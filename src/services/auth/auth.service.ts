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

class AuthService {
  async login(input: ILoginInput) {
    const response = await axios.post<IBaseHttpResponse<ILoginResult>>(
      `${API_ENDPOINT}/auth/Login`,
      input
    );

    const data = response.data.result;
    Cookies.set(ACCESS_TOKEN_KEY, data.accessToken, { sameSite: 'None', secure: true });

    return this.getUserInfo();
  }

  async getUserInfo() {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    const response = await httpService.request<IBaseHttpResponse<IUserInfo>>({
      url: '/users/MyInfo',
      method: 'GET',
    });

    return response.result;
  }

  async refreshToken() {
    try {
      const response = await axios.post<IBaseHttpResponse<IRefreshTokenResult>>(
        `${API_ENDPOINT}/auth/Refresh`
      );

      const data = response.data.result;

      Cookies.set(ACCESS_TOKEN_KEY, data.token);
      return true;
    } catch (error) {
      Cookies.remove(ACCESS_TOKEN_KEY);
      window.location.href = '/auth/login';
      return false;
    }
  }

  async logout() {
    try {
      const token = Cookies.get(ACCESS_TOKEN_KEY);
      console.log('Token khi logout:', token);

      const response = await axios.post<IBaseHttpResponse<null>>(
        `${API_ENDPOINT}/auth/Logout`,
        {
          token: token,
        }
      );

      return response.data.result;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      Cookies.remove(ACCESS_TOKEN_KEY);
      window.location.href = '/auth/login';
    }
  }

  async register(input: IRegisterInput) {
    const response = await axios.post<IBaseHttpResponse<IRegisterResult>>(
      `${API_ENDPOINT}/users/Create`,
      input
    );

    const data = response.data.result;
    return data;
  }
}

const authService = new AuthService();

export default authService;
