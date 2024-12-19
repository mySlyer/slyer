import { ReactNode } from 'react';
import { Home, Package, PencilRuler } from 'lucide-react';
import { GeckoApp, GeckoAppID } from './types/gecko';

export const ICON_MAP: Record<string, ReactNode> = {
  home: <Home className="h-4 w-4" />,
  package: <Package className="h-4 w-4" />,
  draw: <PencilRuler className="h-4 w-4" />,
};

export const NAV_LINKS = [
  // { name: 'Dashboard', href: '/', icon: 'home' },
  { name: '二维码查看', href: '/qrcode', icon: 'package' },
  // { name: 'Excalidraw', href: '/excalidraw', icon: 'draw' },
];

export const ALL_GECKO_APP_ID_LIST = [
  GeckoAppID.Aweme,
  GeckoAppID.AwemeLite,
  GeckoAppID.AwemeHTS,
  GeckoAppID.LifeServiceMidPlatform,
];

export const GECKO_DEPLOYMENT_MAP: Record<GeckoAppID, GeckoApp> = {
  [GeckoAppID.Aweme]: {
    appID: GeckoAppID.Aweme,
    name: '微信群',
    logo: 'https://lf26-geckocdn-tos.pstatp.com/obj/ies.fe.gecko/8cb4ad0a11052ceae8e0b26b8ae49745/%E6%8A%96%E9%9F%B3icon512%E7%9B%B4%E8%A7%92.png',
    prod: {
      deploymentID: 1325,
      accessKey: '2373bbcf94c1b893dad48961d0a2d086',
    },
    test: {
      deploymentID: 1324,
      accessKey: '2d15e0aa4fe4a5c91eb47210a6ddf467',
    },
  },
  [GeckoAppID.AwemeLite]: {
    appID: GeckoAppID.AwemeLite,
    name: '订阅号',
    logo: 'https://sf6-hscdn-tos.pstatp.com/obj/ies.fe.gecko/b93ad371430a91d60d190dc6d8e8f114/icon_launcher.png',
    prod: {
      deploymentID: 10170,
      accessKey: 'f223c6c03fc71345c464c6bac69ed8a8',
    },
    test: {
      deploymentID: 10169,
      accessKey: '89f1b07c15461b520068877f1f4f7fc8',
    },
  },
  [GeckoAppID.AwemeHTS]: {
    appID: GeckoAppID.AwemeHTS,
    name: '服务号',
    logo: 'https://tosv.byted.org/obj/ies.fe.gecko/d02b5ab0874a18f2fc08ce74af2a6c99/20220908-165257.png',
    prod: {
      deploymentID: 11310,
      accessKey: '6861a8c540b1b116de9a78df702dd3e1',
    },
    test: {
      deploymentID: 11309,
      accessKey: 'c9ff63ba5c3c2ad1fa7e3c59fac83875',
    },
  },
  [GeckoAppID.LifeServiceMidPlatform]: {
    appID: GeckoAppID.LifeServiceMidPlatform,
    name: '小程序',
    logo: 'https://tosv.byted.org/obj/ies.fe.gecko/5eca90dc9b679670615154531d8ee7ea/logo.png',
    prod: {
      deploymentID: 11402,
      accessKey: '6ab2d53193ebc9581a793d930d60a7e3',
    },
    test: {
      deploymentID: 11401,
      accessKey: 'fdac12dae4c014a3c3492dce257cd34f',
    },
  },
};
