import crypto from 'crypto';
import { GraphQLClient, gql } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

import { ALL_GECKO_APP_ID_LIST, GECKO_DEPLOYMENT_MAP } from '@/lib/const';
import { GeckoAppID, GeckoPkg } from '@/lib/types/gecko';

function getGraphQLHeaders(body: string) {
  if (!process.env.ACCESS_KEY || !process.env.SECRET_KEY) {
    throw new Error('服务未在环境变量中找到 gecko access_key 和 secret_key');
  }
  const canonicalRequest = `POST\n/gecko/server/graphql\n\ncontent-type;host;x-gecko-user-accesskey\n${body}`;

  // 获取当前时间戳（ms 13位）
  const curTimestamp = Date.now();

  // 使用secretKey对认证字符串前缀进行加签得到signingKey
  const authPrefix = `gecko-auth-v1/${curTimestamp}/30`;
  const signingKeyHmac = crypto.createHmac('sha256', process.env.SECRET_KEY!);
  signingKeyHmac.update(authPrefix);
  const signingKey = signingKeyHmac.digest('hex');

  // 使用signingKey对canonicalRequest进行加签得到最终签名signature
  const signatureHmac = crypto.createHmac('sha256', signingKey);
  signatureHmac.update(canonicalRequest);
  const signature = signatureHmac.digest('hex');

  return {
    'x-gecko-user-accesskey': process.env.ACCESS_KEY!,
    Authorization: `${authPrefix}/${signature}`,
  };
}

const geckoClient = new GraphQLClient(
  'https://gecko.bytedance.net/gecko/server/graphql',
  {
    requestMiddleware(req) {
      req.headers = {
        ...req.headers,
        ...getGraphQLHeaders(req.body as string),
      };
      return req;
    },
  },
);

async function getGeckoPkgInfo(params: {
  channel: string;
  deploymentId: number;
  envLaneName?: string;
}) {
  return geckoClient.request<{
    packages: {
      totalCount: number;
      edges: Array<{
        node: {
          id: number;
          deploymentId: number;
          version: number;
          url: string;
          creator: string;
          targetAppVersion: string;
          targetOS: number;
          description: string;
          issueStatus: 1 | 0;
          issueType: number;
          issueValue: string;
          channel: string;
          createdAt: string;
          updatedAt: string;
          delIfDownloadFailed: 1 | 0;
          delOldPkgBeforeDownload: 1 | 0;
          needUnzip: 1 | 0;
          needSyncOverseas: 1 | 0;
          pkgByteSize: number;
          pkgLarkNoticeGroups: string;
          md5: string;
          packageType: number;
          customDistributeRule: string;
          user: {
            /** 邮箱前缀 */
            username: string;
            /** 姓名 */
            name: string;
            email: string;
            avatar: string;
          };
        };
        cursor: string;
      }>;
      pageInfo: {
        startCursor: string;
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  }>(
    gql`
      query (
        $deploymentId: Int
        $channel: String
        $envLaneName: String
        $issueStatus: Int
        $cursor: Int
        $count: Int
      ) {
        packages(
          deploymentId: $deploymentId
          channel: $channel
          envLaneName: $envLaneName
          issueStatus: $issueStatus
          cursor: $cursor
          count: $count
        ) {
          totalCount
          edges {
            node {
              id
              deploymentId
              version
              url
              creator
              targetAppVersion
              targetOS
              description
              issueStatus
              issueType
              issueValue
              channel
              createdAt
              updatedAt
              delIfDownloadFailed
              delOldPkgBeforeDownload
              needUnzip
              needSyncOverseas
              pkgByteSize
              pkgLarkNoticeGroups
              md5
              packageType
              customDistributeRule
              user {
                username
                name
                email
                avatar
              }
            }
            cursor
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
          }
        }
      }
    `,
    {
      ...params,
      issueStatus: 1,
      cursor: 0,
      count: 1,
    },
  );
}

export async function getChannelDownloadQRCodeList({
  channel,
  isTest = false,
  env,
  appIdList = ALL_GECKO_APP_ID_LIST,
}: {
  channel: string;
  isTest?: boolean;
  env?: string;
  appIdList?: GeckoAppID[];
}): Promise<Array<GeckoPkg>> {
  const queryList = appIdList
    .map((appID) => GECKO_DEPLOYMENT_MAP[appID])
    .map((app) => {
      const deployment = isTest ? app.test : app.prod;
      const { deploymentID, accessKey } = deployment;
      return {
        channel,
        deploymentID,
        accessKey,
        env,
        appName: app.name,
        appID: app.appID,
      };
    });
  return Promise.all(
    queryList.map(
      async ({ appID, appName, channel, deploymentID, accessKey, env }) => {
        const commonRes = {
          appID,
          appName,
          channel,
          deploymentID,
        };
        try {
          const pkg = (
            await getGeckoPkgInfo({
              channel,
              deploymentId: deploymentID,
              envLaneName: env,
            })
          )?.packages?.edges?.[0]?.node;
          if (!pkg) {
            return {
              ...commonRes,
              error: { type: 'pkg-not-exists', message: '该环境暂无离线包' },
            };
          }
          const {
            url,
            version,
            md5,
            packageType,
            pkgByteSize,
            description,
            customDistributeRule,
            user,
            createdAt,
          } = pkg;
          return {
            ...commonRes,
            qrCodeUrl: `sslocal://gecko/download?access_key=${accessKey}&channel=${channel}&version=${version}&url_list=${encodeURIComponent(
              url,
            )}&md5=${md5}&package_type=${packageType}&size=${pkgByteSize}`,
            version,
            description,
            customDistributeRule,
            user,
            createdAt,
          };
        } catch (e: any) {
          console.error(e);
          const errorMsg = e?.response?.errors?.[0]?.message;
          if (errorMsg === 'permission denied') {
            return {
              ...commonRes,
              error: {
                ...e?.response?.errors?.[0],
                message: '无权限，找',
                type: 'no-permission',
              },
            };
          }
          if (errorMsg.includes('目标部署环境下不存在channel')) {
            return {
              ...commonRes,
              error: {
                ...e?.response?.errors?.[0],
                message: 'Channel 不存在',
                type: 'channel-not-exists',
              },
            };
          }
          return {
            ...commonRes,
            error: {
              ...e?.response?.errors?.[0],
              message: errorMsg,
              type: 'unknown',
            },
          };
        }
      },
    ),
  );
}

export async function getMultiChannelDownloadQRCodeList({
  channelList,
  isTest,
  env,
  appIdList,
}: {
  channelList?: string[];
  isTest?: boolean;
  env?: string;
  appIdList?: GeckoAppID[];
}) {
  return Promise.all(
    (channelList || []).map(async (channel) => {
      const res = await getChannelDownloadQRCodeList({
        channel,
        isTest,
        env,
        appIdList,
      });
      return {
        channel,
        geckoPkgs: res,
      };
    }),
  );
}

export async function searchChannel({
  deploymentID,
  keyword,
}: {
  deploymentID: number;
  keyword: string;
}) {
  const res = await geckoClient.request<{
    channels: {
      totalCount: number;
      edges: Array<{
        node: {
          id: number;
          deploymentId: number;
          name: string;
          creator: string;
          modifier: string;
          larkWebhook: string;
          larkWebhookName: string;
          larkWebhookTypes: string;
          customizedWebhook: string;
          customizedWebhookTypes: string;
          createdAt: string;
          updatedAt: string;
          packageType: number;
          channelType: number;
          discard: number;
          serviceTreeId: number;
          status: number;
          user: {
            username: string;
            avatar: string;
            name: string;
            email: string;
          };
          owners: [
            {
              username: string;
              avatar: string;
              name: string;
              email: string;
            },
          ];
        };
        cursor: string;
      }>;
      pageInfo: {
        startCursor: string;
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  }>(
    gql`
      query (
        $deploymentId: Int
        $name: String
        $cursor: Int
        $count: Int
        $discard: Int
        $withNotApproved: Boolean
        $channelType: Int
      ) {
        channels(
          deploymentId: $deploymentId
          name: $name
          cursor: $cursor
          count: $count
          discard: $discard
          withNotApproved: $withNotApproved
          channelType: $channelType
        ) {
          totalCount
          edges {
            node {
              id
              deploymentId
              name
              creator
              modifier
              larkWebhook
              larkWebhookName
              larkWebhookTypes
              customizedWebhook
              customizedWebhookTypes
              customDistributeRule
              createdAt
              updatedAt
              packageType
              channelType
              discard
              serviceTreeId
              status
              user {
                username
                avatar
                name
                email
              }
              owners {
                username
                avatar
                name
                email
              }
            }
            cursor
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
          }
        }
      }
    `,
    {
      deploymentId: deploymentID,
      name: keyword,
      cursor: 0,
      count: 20,
      discard: 0,
      withNotApproved: true,
      channelType: 0,
    },
  );

  return res?.channels?.edges?.map((edge) => {
    return edge?.node;
  });
}

export async function searchChannelInAllApps({
  keyword,
  isTest = false,
}: {
  keyword: string;
  isTest?: boolean;
}) {
  const queryList = ALL_GECKO_APP_ID_LIST.map(
    (appID) => GECKO_DEPLOYMENT_MAP[appID],
  ).map((app) => {
    const deployment = isTest ? app.test : app.prod;
    const { deploymentID } = deployment;
    return {
      deploymentID,
      keyword,
    };
  });
  const res = await Promise.all(
    queryList.map(async ({ deploymentID, keyword }) => {
      try {
        const res = await searchChannel({ deploymentID, keyword });
        return res;
      } catch (e) {
        console.error(e);
        return [];
      }
    }),
  );
  return res.flat();
}

export function useChannelID(
  {
    channel,
    deploymentID,
  }: {
    channel: string;
    deploymentID?: number;
  },
  enabled?: boolean,
) {
  return useQuery({
    queryKey: ['channel-id', { channel, deploymentID }],
    async queryFn() {
      if (!deploymentID) {
        return undefined;
      }
      const res = await fetch(
        `/api/gecko/channel/${channel}?${new URLSearchParams({ deploymentID: String(deploymentID) }).toString()}`,
      );
      const channelInfo = (await res.json())?.channel as Awaited<
        ReturnType<typeof searchChannel>
      >;
      return channelInfo?.find((item) => item.name === channel)?.id;
    },
    enabled,
  });
}
