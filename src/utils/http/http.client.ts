import axios, { AxiosInstance, AxiosResponse } from 'axios';

export abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handlerResponse,
      this._handlerError,
    );
  };

  private _handlerResponse = async (data: AxiosResponse) => {
    return data.data;
  };

  protected _handlerError = (error: any) => Promise.reject(error);
}
