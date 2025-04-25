/* eslint-disable no-extra-boolean-cast */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Link, Stack, TextField, Typography, Paper } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import LoadingButton from '@/components/button/loading-button';
import PasswordInput from '@/components/field/password-input';
import SelectChangeLocale from '@/components/field/select-change-locale';
import useTranslation from '@/hooks/use-translation';
import i18n from '@/i18n';
import appService from '@/services/app/app.service';
import { AuthContext } from '@/services/auth/auth.context';
import { ILoginInput } from '@/services/auth/auth.model';
import authService from '@/services/auth/auth.service';

// Validation schema unchanged
const loginSchema = yup.object({
  name: yup.string().required(i18n.t('userNameOrEmailAddress-required')),
  password: yup.string().required(i18n.t('password-required')),
});

const LoginPage = () => {
  const [, dispatch] = useContext(AuthContext);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema), mode: 'onChange' });

  const { mutate, isLoading: loginLoading } = useMutation({
    mutationFn: (data: ILoginInput) => authService.login(data),
    onSuccess: (data) => {
      dispatch({ type: 'setIsAuth', payload: true });
      dispatch({ type: 'setCurrentUser', payload: data });
      appService.hideLoadingModal();
      enqueueSnackbar(t('Đăng nhập thành công'), { variant: 'success' });
      queryClient.refetchQueries({ queryKey: ['auth/getUserInfo'] });
    },
    onError: (err: any) => {
      appService.hideLoadingModal();
      enqueueSnackbar(err.response.data.message || t('Đã có lỗi xảy ra'), { variant: 'error' });
    },
  });

  const onSubmit = (data: ILoginInput) => {
    mutate(data);
    appService.showLoadingModal();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
        position: 'relative',
      }}
    >
      {/* Background image with subtle dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Centered card container */}
      <Paper
        elevation={6}
        sx={{
          maxWidth: 480,
          width: '100%',
          mx: 2,
          p: 4,
          borderRadius: 3,
          backgroundColor: 'common.white',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Stack spacing={3} sx={{ mb: 4, position: 'relative' }}>
          <SelectChangeLocale
            buttonProps={{ className: 'btn-locale', size: 40, sx: { fontSize: 24 } }}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          />
          <Typography variant="h4" color="primary.main">
            {t('Đăng nhập')}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {t('Chưa có tài khoản') + '? '}
            <Link href="/auth/register" underline="hover">
              {t('Đăng ký ngay')}
            </Link>
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label={t('Tên người dùng hoặc Email')}
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              disabled={loginLoading}
              required
              {...register('name')}
            />

            <PasswordInput
              fullWidth
              label={t('Mật khẩu')}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
              disabled={loginLoading}
              required
              {...register('password')}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={loginLoading}
              sx={{ mt: 2 }}
            >
              {t('Đăng nhập')}
            </LoadingButton>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
