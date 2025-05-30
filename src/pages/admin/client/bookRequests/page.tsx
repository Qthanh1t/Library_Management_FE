import BaseCrudPage from '@/base/base-crud-page';
import useTranslation from '@/hooks/use-translation';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';



import { TCrudFormField } from '@/base/crud-form-field.type';
import { hashUUIDTo8Char } from '@/services/utils';
import useAuth from '@/hooks/use-auth';
import bookRequestsService from './_services/bookRequests.service';
import { formatDate } from '@/services/utils-date';
import BookRequestStatusChip from './_components/book-request-status-chip';
import BookRequestTypeChip from './_components/book-request-type-chip';

const BookRequestsClientPage = () => {
    const { t } = useTranslation();
    const authQuery = useAuth();

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: "id",
            headerName: t('ID'),
            type: 'text',
            width: 150,
            renderCell: (params) => (params.row.id),
        },
        {
            field: "bookCopyId",
            headerName: t('Id bản ghi'),
            type: 'text',
            width: 150,
            renderCell: (params) => (params.row.bookCopyId),
        },
        {
            field: 'bookTitle',
            headerName: t('Tiêu đề'),
            type: 'text',
            width: 200,
            flex: 1,
        },
        {
            field: 'type',
            headerName: t('Loại'),
            type: 'text',
            width: 200,
            renderCell: (params) => <BookRequestTypeChip type={params.row.type} />,
        },
        {
            field: 'status',
            headerName: t('Trạng thái'),
            type: 'text',
            width: 200,
            renderCell: (params) => <BookRequestStatusChip status={params.row.status} />,
        },
        {
            field: 'updatedAt',
            headerName: t('Cập nhật lần cuối'),
            type: 'text',
            width: 250,
            renderCell: (params) => formatDate(params.row.updatedAt, 'DD/MM/YYYY HH:mm'),
        }
    ], [t]);


    const viewFields = useMemo<TCrudFormField[]>(
        () => [
            {
                name: 'id',
                label: t('ID'),
                type: 'text',
                colSpan: 6,
                readOnly: true,
                formatValue: (value) => (value),
            },
            {
                name: 'bookCopyId',
                label: t('Id bản ghi'),
                type: 'text',
                colSpan: 6,
                readOnly: true,
                formatValue: (value) => (value),
            },
            {
                name: 'bookTitle',
                label: t('Tiêu đề'),
                type: 'text',
                colSpan: 12,
                readOnly: true,
            },
            {
                name: 'type',
                label: t('Loại'),
                type: 'text',
                colSpan: 6,
                readOnly: true,
                formatValue: (value) => t(value),
            },
            {
                name: 'status',
                label: t('Trạng thái'),
                type: 'text',
                colSpan: 6,
                formatValue: (value) => t(value),
                readOnly: true,
            },

        ],
        [t],
    );


    return (
        <>
            <BaseCrudPage
                title={t('Danh sách yêu cầu đã tạo')}
                name='bookRequests'
                unitName={t('Danh sách yêu cầu đã tạo')}
                service={bookRequestsService}
                columns={columns}
                hideImportExcelBtn
                hideExportExcelBtn
                hideSearchInput
                hideSelectRowCheckbox
                hideAddBtn
                hideDeleteAction
                hideDeleteManyBtn
                hideEditAction
                viewFields={viewFields}
                beautyView
                defaultGetAllParams={{
                    userId: authQuery.data?.id,
                }}
            />
        </>
    );
}
export default BookRequestsClientPage;
