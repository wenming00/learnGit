// index.ts
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  instance: AxiosInstance; // axios 实例
  baseConfig: AxiosRequestConfig = { baseURL: '', timeout: 60000 }; // 基础配置，url和超时时间

  constructor(config: AxiosRequestConfig) {
    
    this.instance = axios.create(Object.assign(this.baseConfig, config)); // 使用axios.create创建axios实例

    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token") as string
				token && (config.headers!.Authorization = token);
        return config;
      },
      (err: AxiosError) => {
        return Promise.reject(err);
      }
    );

    this.instance.interceptors.response.use(async(res: AxiosResponse) => {
				try {
						const { data, code } = res.data as Result<any>;
						return await handleCode({ data, code, res });
				} catch (err) {
						return Promise.reject(err);
				}
      },
      (err: AxiosError) => {
        return Promise.reject(err);
      }
    );
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Result<T>>> {
    return this.instance.delete(url, config);
  }
}

function handleCode({ data, code, res }: { data: any, code: number, res: AxiosResponse }) {
	const codeMap: { [key: number]: () => Promise<any> } = {
		0() {
			return Promise.resolve(data);
		}
	}
	return codeMap[code] ? codeMap[code]() : Promise.reject(res);
}

// 默认导出Request实例
export default new Request({})
