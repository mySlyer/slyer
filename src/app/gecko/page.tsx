import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import HelpIcon from '@/components/help-icon';
import { ALL_GECKO_APP_ID_LIST, GECKO_DEPLOYMENT_MAP } from '@/lib/const';
import GeckoSearchForm from './form';
import GeckoDownloadTableBody from './table-body';
import GeckoPkgDetail from './gecko-pkg-detail';

export default function GeckoDownloadList() {
  return (
    <article className="flex flex-1 h-0 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
      <div className="items-center justify-center rounded-lg border border-dashed shadow-sm p-4">
        <legend className="text-sm font-medium -mt-2 translate-y-[-1.1rem] bg-[hsl(var(--background))] w-fit px-1">
          Channel 与环境
        </legend>
        <GeckoSearchForm />
      </div>
      <div className="flex flex-col flex-1 rounded-lg border border-dashed shadow-sm p-4">
        <legend className="text-sm font-medium -mt-2 translate-y-[-1.1rem] bg-[hsl(var(--background))] w-fit px-1 flex items-center">
          下载二维码
          <HelpIcon
            tips="生活服务中台是通用的 gecko 应用，无论你正在使用哪个端 app 测试，都请扫描下载生活服务中台的 gecko 包"
            side="right"
            className="ml-1 cursor-pointer"
          />
        </legend>
        <div className="flex flex-1 h-0">
          <div className="flex-1 w-0 md:border-r">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  {ALL_GECKO_APP_ID_LIST.map((appID) => (
                    <TableHead key={appID}>
                      {GECKO_DEPLOYMENT_MAP[appID].name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <GeckoDownloadTableBody />
            </Table>
          </div>
          <div className="w-[312px] pl-3 hidden md:block sticky top-0 h-fit">
            <GeckoPkgDetail />
          </div>
        </div>
      </div>
    </article>
  );
}
