import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import { useState, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as R from 'rambda';

import {
  PublishedWithChangesRounded,
  Person2TwoTone as PersonIcon,
  CategorySharp,
  BookTwoTone as BookIcon,
  ReceiptLongTwoTone as ReceiptIcon,
  PaidTwoTone as PaidIcon,
  HandshakeTwoTone as RequestIcon,
  GroupTwoTone as GroupIcon,
  SettingsTwoTone,
  MenuTwoTone as MenuIcon,
  TranslateTwoTone as TranslateIcon,
} from '@mui/icons-material';

import { useScroll } from 'react-use';
import { MainScrollbarContext } from '@/components/scrollbar';
import SelectChangeLocale from '@/components/field/select-change-locale';
import Logo from '@/components/logo';
import usePopover from '@/hooks/use-popover';
import { AbpContext } from '@/services/abp/abp.context';
import useTranslation from '@/hooks/use-translation';
import { ADMIN_LAYOUT, APP_NAME } from '@/configs/constant.config';
import { ALL_PERMISSIONS } from '@/configs/permissions.constant';
import AccountPopover from './account-popover';
import LanguagePopover from './language-popover';
import { Avatar, styled } from '@mui/material';

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
  flexShrink: 0,
  height: 45,
  width: 45,
  padding: 2,
  '& > img': {
    borderRadius: '50%',
  },
}));

const checkPermission = (grantedPermissions, permissions) => {
  if (!permissions || permissions.length === 0) return true;
  return R.intersection(grantedPermissions, permissions).length > 0;
};

const TopNav = ({ onNavOpen, openNavLg }) => {
  const { scrollableNodeRef } = useContext(MainScrollbarContext);
  const { y: scrollY } = useScroll(scrollableNodeRef);
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [abpState] = useContext(AbpContext);

  const accountPopover = usePopover();
  const languagePopover = usePopover();

  const [anchorEl, setAnchorEl] = useState({});

  const handleMenuOpen = (event, key) => {
    setAnchorEl((prev) => ({ ...prev, [key]: event.currentTarget }));
  };

  const handleMenuClose = (key) => {
    setAnchorEl((prev) => ({ ...prev, [key]: null }));
  };

  const items = useMemo(() => [
    {
      key: 'publishers',
      title: t('Nhà xuất bản'),
      path: '/publishers',
      permissions: [ALL_PERMISSIONS.Publisher_Admin],
    },
    {
      key: 'authors',
      title: t('Tác giả'),
      path: '/authors',
      permissions: [ALL_PERMISSIONS.Author_Admin],
    },
    {
      key: 'categories',
      title: t('Thể loại'),
      path: '/categories',
      permissions: [ALL_PERMISSIONS.Category_Admin],
    },
    {
      key: 'books',
      title: t('Quản lý sách'),
      path: '/books',
      permissions: [ALL_PERMISSIONS.Book_Create],
    },
    {
      key: 'bookLoans',
      title: t('Quản lý mượn trả sách'),
      path: '/bookLoans',
      permissions: [ALL_PERMISSIONS.BookLoan_Admin],
    },
    {
      key: 'fines',
      title: t('Quản lý phạt'),
      path: '/fines',
      permissions: [ALL_PERMISSIONS.Fine_Admin],
    },
    {
      key: 'client-books',
      title: t('Danh mục sách'),
      path: '/client/books',
      permissions: [ALL_PERMISSIONS.Book_Client],
    },
    {
      key: 'client-loans',
      title: t('Danh mục sách mượn'),
      path: '/client/bookLoans',
      permissions: [ALL_PERMISSIONS.BookLoan_Client],
    },
    {
      key: 'client-requests',
      title: t('Danh sách yêu cầu đã tạo'),
      path: '/client/bookRequests',
      permissions: [ALL_PERMISSIONS.BookRequest_Client],
    },
    {
      key: 'client-fines',
      title: t('Danh sách hình phạt'),
      path: '/client/fines',
      permissions: [ALL_PERMISSIONS.Fine_Client],
    },
    {
      key: 'admin',
      title: t('Quản trị'),
      permissions: [ALL_PERMISSIONS.User_GetAll],
      children: [
        {
          key: 'roles',
          title: t('Vai trò'),
          path: '/system/roles',
          permissions: [ALL_PERMISSIONS.Role_Update],
        },
        {
          key: 'accounts',
          title: t('Danh sách người dùng'),
          path: '/system/accounts',
          permissions: [ALL_PERMISSIONS.User_GetAll],
        },
        {
          key: 'staffs',
          title: t('Danh sách nhân viên'),
          path: '/system/staffs',
          permissions: [ALL_PERMISSIONS.Staff_GetAll],
        },
      ],
    },
    {
      key: 'settings',
      title: t('Cài đặt'),
      children: [
        {
          key: 'my-account',
          title: t('Tài khoản của tôi'),
          path: '/settings/my-account',
          permissions: [],
        },
        {
          key: 'change-password',
          title: t('Đổi mật khẩu'),
          path: '/settings/change-password',
          permissions: [],
        },
      ],
    },
  ], [t]);

  const PADDING_LEFT = lgUp && openNavLg ? ADMIN_LAYOUT.SIDE_NAV_WIDTH : 0;
  const BG_COLOR = alpha(theme.palette.common.white, 0.95);
  const TEXT_COLOR = alpha(theme.palette.getContrastText(BG_COLOR), 0.5);

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: BG_COLOR,
          position: 'sticky',
          left: { lg: PADDING_LEFT },
          top: 0,
          width: { lg: `calc(100% - ${PADDING_LEFT}px)` },
          zIndex: theme.zIndex.appBar,
          height: 64,
          borderBottom:
            scrollY > 0 ? `1px solid ${theme.palette.grey[200]}` : undefined,
        }}
      >
        <Toolbar sx={{ minHeight: ADMIN_LAYOUT.TOP_NAV_HEIGHT, px: 2 }}>
          {!lgUp && (
            <IconButton onClick={onNavOpen} sx={{ color: theme.palette.text.primary }}>
              <MenuIcon />
            </IconButton>
          )}

          <IconButton onClick={() => navigate('/')}>
            <Logo />
          </IconButton>

          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            {APP_NAME}
          </Typography>

          {items
            .filter(item =>
              checkPermission(abpState.permissions, item.permissions) ||
              (item.children &&
                item.children.some(child =>
                  checkPermission(abpState.permissions, child.permissions)
                ))
            )
            .map(item =>
              item.children ? (
                <Box key={item.key}>
                  <Button
                    color="inherit"
                    startIcon={item.icon}
                    onClick={(e) => handleMenuOpen(e, item.key)}
                    sx={{
                      backgroundColor: anchorEl[item.key] ? 'rgba(0,0,0,0.04)' : 'transparent',
                      ml: 1,
                      padding: 1,
                    }}
                  >
                    {item.title}
                  </Button>
                  <Menu
                    anchorEl={anchorEl[item.key]}
                    open={Boolean(anchorEl[item.key])}
                    onClose={() => handleMenuClose(item.key)}
                  >
                    {item.children
                      .filter(child =>
                        checkPermission(abpState.permissions, child.permissions)
                      )
                      .map(child => (
                        <MenuItem
                          key={child.key}
                          selected={location.pathname === child.path}
                          onClick={() => {
                            navigate(child.path);
                            handleMenuClose(item.key);
                          }}
                        >
                          {child.title}
                        </MenuItem>
                      ))}
                  </Menu>
                </Box>
              ) : (
                <Button
                  key={item.key}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor:
                      location.pathname === item.path ? 'rgba(0,0,0,0.04)' : 'transparent',
                    ml: 1,
                    padding: 1,
                  }}
                >
                  {item.title}
                </Button>
              )
            )}

          <SelectChangeLocale
            buttonProps={{
              variant: 'text',
              size: 38,
              icon: <TranslateIcon fontSize="medium" />,
              sx: {
                borderColor: theme.palette.grey[200],
                color: TEXT_COLOR,
                p: 0,
                ml: 1,
              },
            }}
            menuProps={{
              anchorOrigin: {
                horizontal: 'right',
                vertical: 44,
              },
            }}
          />

          <IconButton
            style={{ padding: 0, marginLeft: 8 }}
            onClick={accountPopover.handleOpen}
            ref={accountPopover.anchorRef}
          >
            <AvatarStyled src="" />
          </IconButton>
        </Toolbar>
      </Box>

      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
      <LanguagePopover
        anchorEl={languagePopover.anchorRef.current}
        open={languagePopover.open}
        onClose={languagePopover.handleClose}
      />
    </>
  );
};

export default TopNav;
