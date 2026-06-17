import { Observable, of, Subscriber } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import { encodeObjects } from "@/libs/utils";
import { getInLocalStorage } from "@/utilities/local-storage-manager";
const SERVER_NEW_API = import.meta.env.VITE_BACKOFFICE_BASE_URL;

const token = getInLocalStorage("TOKEN");

const serverUrl = `${SERVER_NEW_API}`;

export class RestApi {
  static get = <T = any>(url: string, headers?: Record<string, string>, paramsObj?: any) => {
    const searchParams = paramsObj ? "?" + encodeObjects(paramsObj) : "";
    url = `${serverUrl}${url}${searchParams}`;
    return ajax.getJSON<T>(url, {
      ...(headers || {}),
    });
  };

  static secureGet = <T = any>(
    accessToken: string,
    url: string,
    headers?: Record<string, string>,
    paramsObj?: any
  ): Observable<any> => {
    const searchParams = paramsObj ? "?" + encodeObjects(paramsObj) : "";

    url = `${serverUrl}${url}${searchParams}`;

    return ajax.getJSON<T>(url, {
      ...(headers || {}),

      Bearer: `${token || accessToken}`,
      // ["ngrok-skip-browser-warning"]: "true",
    });
  };

  /******TEST FETCH******/
  static secureGetTest = <T = any>(
    accessToken: string,
    url: string,
    headers?: Record<string, string>,
    paramsObj?: any
  ): Observable<T> => {
    const searchParams = paramsObj ? "?" + encodeObjects(paramsObj) : "";

    url = `${serverUrl}${url}${searchParams}`;

    return ajax.getJSON<T>(url, {
      ...(headers || {}),

      Bearer: `${token || accessToken}`,
      // ["ngrok-skip-browser-warning"]: "true",
    });
  };
  /******TEST FETCH******/

  static post = <T = any>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    useServerUrl: boolean = true
  ) => {
    url = useServerUrl ? `${serverUrl}${url}` : url;
    return ajax
      .post<T>(url, body, {
        ...(headers || {}),
      })
      .pipe(map((resp) => resp.response));
  };

  static securePost = <T = any>(
    tokenBearer: string,
    url: string,
    body?: any,
    headers?: Record<string, string>
  ) => {
    url = `${serverUrl}${url}`;

    return ajax
      .post<T>(url, body, {
        ...(headers || {}),
        // Bearer: `${tokenBearer}`, TODO
        Authorization: `Bearer ${tokenBearer}`,
      })
      .pipe(map((resp: any) => resp.response));
  };

  static patch = <T = any>(url: string, body?: any, headers?: Record<string, string>) => {
    url = `${serverUrl}${url}`;
    return ajax
      .patch<T>(url, body, {
        ...(headers || {}),
      })
      .pipe(map((resp) => resp.response));
  };

  static securePatch = <T = any>(
    tokenBearer: string,
    url: string,
    body?: any,
    headers?: Record<string, string>
  ) => {
    url = `${serverUrl}${url}`;

    return ajax
      .patch<T>(url, body, {
        ...(headers || {}),
        Bearer: `${token || tokenBearer}`,
      })
      .pipe(map((resp: any) => resp.response));
  };

  static put = <T = any>(url: string, body?: any, headers?: Record<string, string>) => {
    url = `${serverUrl}${url}`;
    return ajax
      .put<T>(url, body, {
        ...(headers || {}),
      })
      .pipe(map((resp) => resp.response));
  };

  static securePut = <T = any>(url: string, body?: any, headers?: Record<string, string>) => {
    url = `${serverUrl}${url}`;
    const accessToken = localStorage.getItem("accessToken");
    return ajax
      .put<T>(url, body, {
        ...(headers || {}),
        authorization: `bearer ${accessToken}`,
      })
      .pipe(map((resp: any) => resp.response));
  };

  delete = <T = any>(url: string, headers?: Record<string, string>) => {
    url = `${serverUrl}${url}`;
    return ajax
      .delete<T>(url, {
        ...(headers || {}),
      })
      .pipe(map((resp) => resp.response));
  };

  static secureDelete = <T = any>(token: string, url: string, headers?: Record<string, string>) => {
    url = `${serverUrl}${url}`;

    return ajax
      .delete<T>(url, {
        ...(headers || {}),
        Bearer: `${token}`,
      })
      .pipe(map((resp: any) => resp.response));
  };

  static postS3 = <T = any>(url: string, body?: any, headers?: Record<string, string>) => {
    return ajax
      .post<T>(url, body, {
        ...(headers || {}),
      })
      .pipe(map((resp) => resp.response));
  };

  static postS3Progression = <T = any>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    progressSubscriber?: Subscriber<any>
  ) => {
    return ajax<T>({
      url: url,
      method: "POST",
      body: body,
      headers: headers || {},
      progressSubscriber: progressSubscriber,
      // includeUploadProgress:  true // TODO test
    }).pipe(map((resp) => resp.response as T));
  };

  static downloadFile = (accessToken: string, url: string, headers?: Record<string, string>) => {
    const fileUrl = `${serverUrl}${url}`;
    return ajax({
      url: fileUrl,
      method: "GET",
      responseType: "blob",
      headers: {
        ...(headers || {}),
        authorization: `bearer ${accessToken}`,
      },
    }).pipe(
      catchError(() => {
        return of(null);
      })
    );
  };
}
