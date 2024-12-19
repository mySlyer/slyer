import 'server-only';
import * as lark from '@larksuiteoapi/node-sdk';

export async function handleLarkEvent(data: any) {
  if (!data) {
    console.error('empty body');
    return {};
  }
  if ('encrypt' in data && !process.env.LARK_ENCRYPT_KEY) {
    console.error(
      'auto-challenge need encryptKey, please check for missing in dispatcher',
    );
    return {};
  }
  const targetData =
    'encrypt' in data
      ? JSON.parse(
          new lark.AESCipher(process.env.LARK_ENCRYPT_KEY).decrypt(
            data.encrypt,
          ),
        )
      : data;
  const isChallenge = targetData.type === 'url_verification';
  if (isChallenge) {
    return { challenge: targetData.challenge };
  }
  /** 链接预览 */
  if (targetData.header?.event_type === 'url.preview.get') {
    const url = targetData.event?.context?.url;
    if (!url || !url.startsWith('https://life-fe-helper.fn.bytedance.net')) {
      return {};
    }
    const urlObj = new URL(url);
    if (urlObj.pathname === '/gecko') {
      const isTest = urlObj.searchParams.get('isTest') !== 'false';
      const env = urlObj.searchParams.get('env');
      const channels = (urlObj.searchParams.get('channels') || '')
        .split(',')
        .filter(Boolean);
      return {
        inline: {
          i18n_title: {
            zh_cn: '批量下载 Gecko',
            en_us: 'Batch download Gecko packages',
          },
          image_key: 'img_v3_02a1_920bb186-89ca-4061-9f57-7aa8c1e6819g',
        },
        card: channels.length
          ? {
              type: 'template',
              data: {
                template_id: 'AAqkitiPheD16',
                template_variable: {
                  title: '批量下载 Gecko',
                  subtitle: '你要扫描的二维码全在这儿了',
                  env: isTest ? env || '内测环境' : '正式环境',
                  channel_list_md: channels
                    .map((channel) => '- ' + channel)
                    .join('\n'),
                  url,
                },
              },
            }
          : undefined,
      };
    }
    return {
      inline: {
        i18n_title: {
          zh_cn: '二维码分享',
          en_us: "qrcode toolbox",
        },
        image_key: 'img_v3_02a1_ab04423c-035c-4525-99b1-36b59d7f088g',
      },
    };
  }
  // TODO: 其它事件处理，可以借助 lark.EventDispatcher
  return {};
}
