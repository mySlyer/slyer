import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function LoadingGeckoDownloadList() {
  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Skeleton className="h-[16px] w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[120px] w-[120px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[120px] w-[120px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[120px] w-[120px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[120px] w-[120px]" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="h-[16px] w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[120px] w-[120px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[120px] w-[120px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[120px] w-[120px]" />
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
