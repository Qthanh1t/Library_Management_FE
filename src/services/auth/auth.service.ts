import axios from 'axios';
import Cookies from 'js-cookie';

import { IBaseHttpResponse } from '@/base/base.model';
import { httpService } from '@/base/http-service';
import { API_ENDPOINT, ACCESS_TOKEN_KEY } from '@/configs/constant.config';

import {
  ILoginInput,
  ILoginResult,
  IRefreshTokenResult,
  IRegisterInput,
  IRegisterResult,
  IUserInfo,
} from './auth.model';

const REFRESH_TOKEN_KEY = 'refresh_token';

class AuthService {
  // Đăng nhập
  async login(input: ILoginInput) {
    const response = await axios.post<IBaseHttpResponse<ILoginResult>>(
      `${API_ENDPOINT}/auth/Login`,
      input
    );

    const data = response.data.result;

    // Lưu access token vào cookie
    Cookies.set(ACCESS_TOKEN_KEY, data.accessToken, { sameSite: 'None', secure: true });

    // Lưu refresh token vào localStorage
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

    return this.getUserInfo();
  }

  // Lấy thông tin user
  async getUserInfo() {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!accessToken) {
      if (refreshToken) {
        const refresh = await this.refreshToken();
        if (!refresh) throw new Error('Access token is required');
      }
      else {
        throw new Error('Access token is required');
      }
    }

    const response = await httpService.request<IBaseHttpResponse<IUserInfo>>({
      url: '/users/MyInfo',
      method: 'GET',
    });

    return response.result;
  }

  // Refresh access token bằng refresh token
  async refreshToken() {
    //console.log('refreshTokennnn');
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await axios.post<IBaseHttpResponse<IRefreshTokenResult>>(
        `${API_ENDPOINT}/auth/Refresh`,
        { refreshToken }
      );

      const data = response.data.result;

      // Lưu access token mới vào cookie
      Cookies.set(ACCESS_TOKEN_KEY, data.accessToken, { sameSite: 'None', secure: true });

      // Nếu có refresh token mới thì lưu lại
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }

      return true;
    } catch (error) {
      this.clearTokens();
      window.location.href = '/auth/login';
      return false;
    }
  }

  // Đăng xuất
  async logout() {
    try {
      const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

      await axios.post<IBaseHttpResponse<null>>(
        `${API_ENDPOINT}/auth/Logout`,
        { accessToken }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
      window.location.href = '/auth/login';
    }
  }

  // Đăng ký
  async register(input: IRegisterInput) {
    const response = await axios.post<IBaseHttpResponse<IRegisterResult>>(
      `${API_ENDPOINT}/users/Create`,
      input
    );

    return response.data.result;
  }

  // Hàm tiện ích: clear cả access token và refresh token
  private clearTokens() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

const authService = new AuthService();
export default authService;
