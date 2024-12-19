export default function HelpContent() {
  return (
    <>
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Gecko 批量下载
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
        一次性下载测试环境最新的 gecko 包
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        这个工具的典型使用场景，是 FE 提测后，将需求涉及到的 channel
        在测试环境中的最新 gecko 二维码交给 QA，确保 QA
        正在测试的功能是测试环境的最新代码。
      </p>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        什么是 channel：简单理解，channel
        是前端代码发布的一个基本单位，一个页面的前端代码会来自一个或多个
        channel。
      </blockquote>
      <p className="leading-7 [&:not(:first-child)]:mt-6">典型使用流程：</p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>FE 同学打开本工具，填入 gecko channel 列表和环境信息。</li>
        <li>FE 同学点击右上角分享按钮，将分享链接发送给 QA 同学。</li>
        <li>
          QA 同学打开 FE 分享的链接，测试时及时刷新页面，获取最新的 gecko
          下载二维码。
        </li>
        <li>QA 同学根据自己正在测试的端类型，扫描对应端的二维码。</li>
      </ul>
      <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
        关于生活服务中台
      </h4>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        需要注意的是<i>生活服务中台</i>是一个特殊的 gecko
        应用，它可以跨端使用。如果一个 channel 既有生活服务中台的
        gecko，又有具体端的 gecko，QA 同学在测试前请跟 FE
        确认清楚需要扫描的二维码是对应的端还是每个端都扫描生活服务中台的二维码。
      </p>
      <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
        关于权限
      </h4>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        本工具利用了 gecko 的 open api 请求 gecko
        的数据，请求数据的密钥使用个人的 ak sk
        构造，因此权限也是继鹏的个人权限。 如果发现某个 channel
        的二维码不出现且提示无访问权限，请联系继鹏让他申请权限。
      </p>
    </>
  );
}
