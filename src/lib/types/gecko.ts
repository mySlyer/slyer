export enum GeckoAppID {
  Aweme = 1903,
  AwemeLite = 10073,
  AwemeHTS = 10538,
  LifeServiceMidPlatform = 10587,
}

interface GeckoDeployment {
  deploymentID: number;
  accessKey: string;
}

export interface GeckoApp {
  appID: GeckoAppID;
  name: string;
  prod: GeckoDeployment;
  test: GeckoDeployment;
  logo: string;
}

export interface GeckoPkg {
  appID: GeckoAppID;
  appName: string;
  channel: string;
  qrCodeUrl?: string;
  version?: number;
  description?: string;
  customDistributeRule?: string;
  user?: { username: string; name: string; email: string; avatar: string };
  createdAt?: string;
  deploymentID?: number;
  error?: {
    message?: string;
    type?:
      | 'channel-not-exists'
      | 'pkg-not-exists'
      | 'no-permission'
      | 'unknown';
  };
}
