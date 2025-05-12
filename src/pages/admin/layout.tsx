import { Box, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ComponentType, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Scrollbar, { MainScrollbarContext } from '@/components/scrollbar';
import useAbp from '@/hooks/use-abp';
import useAuth from '@/hooks/use-auth';
import AbpProvider from '@/services/abp/abp.context';
import appService from '@/services/app/app.service';

import TopNav from './_components/top-nav';

const LayoutWrapper = styled(Box)({
  display: 'flex',
  flex: '1 1 auto',
  minHeight: 0,
  maxWidth: '100%',
  flexDirection: 'column',
  backgroundColor: '#f4f6f8',
});

const LayoutContainer = styled(Scrollbar)({
  display: 'flex',
  flex: '1 1 auto',
  minHeight: 0,
  flexDirection: 'column',
  width: '100%',
});

const StyledWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
});

const AdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const scrollableNodeRef = useRef<HTMLElement>(null);
  const [openNav, setOpenNav] = useState(false);

  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  const authQuery = useAuth();
  const { abpQuery } = useAbp();

  useEffect(() => {
    if (authQuery.isLoading || abpQuery.isLoading) {
      appService.showLoadingModal();
    }
    if (!authQuery.isLoading && !abpQuery.isLoading) {
      appService.hideLoadingModal();
    }
    if (authQuery.isError) {
      navigate(`/auth/login?redirect=${pathname}`);
    }
  }, [
    abpQuery.isLoading,
    authQuery.isError,
    authQuery.isLoading,
    authQuery.isSuccess,
    navigate,
    pathname,
  ]);

  useEffect(() => {
    handlePathnameChange();
  }, [pathname]);

  return authQuery.isSuccess ? (
    <MainScrollbarContext.Provider value={{ scrollableNodeRef }}>
      <StyledWrapper>
        <TopNav onNavOpen={() => setOpenNav(true)} openNavLg={false} />

        <LayoutWrapper>
          <LayoutContainer>
            <Outlet />
          </LayoutContainer>
        </LayoutWrapper>
      </StyledWrapper>
    </MainScrollbarContext.Provider>
  ) : (
    <></>
  );
};

const withAbpProvider = (Component: ComponentType<any>) =>
  function WrappedAdminLayout(props: any) {
    return (
      <AbpProvider>
        <Component {...props} />
      </AbpProvider>
    );
  };

export default withAbpProvider(AdminLayout);
