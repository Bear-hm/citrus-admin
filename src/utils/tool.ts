interface Tool {
  cookie: {
    set(
      name: string,
      value: string,
      expires?: Date,
      domain?: string,
      path?: string,
      secure?: boolean
    ): void;
    get(name: string): string;
    remove(
      name: string,
      domain?: string,
      path?: string,
      secure?: boolean
    ): void;
  };
  data: {
    set(table: string, settings: any): void;
    get(table: string): any;
    remove(table: string): void;
    clear(): void;
  };
  session: {
    set(table: string, settings: any): void;
    get(table: string): any;
    remove(table: string): void;
    clear(): void;
  };
  screen(element: HTMLElement): void;
  objCopy<T>(obj: T): T;
  dateFormat(date: Date | string | number, fmt?: string): string;
  groupSeparator(num: number | string): string;
  http: {
    stringify(data: Record<string, any>): string;
  };
}

const tool: Tool = {
  cookie: {
    set(
      name: string,
      value: string,
      expires?: Date,
      domain?: string,
      path?: string,
      secure?: boolean
    ): void {
      let cookieText = "";
      cookieText += encodeURIComponent(name) + "=" + encodeURIComponent(value);
      if (expires instanceof Date) {
        cookieText += "; expires=" + expires.toString();
      }
      if (path) {
        cookieText += "; path=" + path;
      }
      if (domain) {
        cookieText += "; domain=" + domain;
      }
      if (secure) {
        cookieText += "; secure";
      }
      document.cookie = cookieText;
    },

    get(name: string): string {
      const cookieName = encodeURIComponent(name) + "=";
      const cookieStart = document.cookie.indexOf(cookieName);
      let cookieValue = "";
      if (cookieStart > -1) {
        let cookieEnd = document.cookie.indexOf(";", cookieStart);
        if (cookieEnd == -1) {
          cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(
          document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
        );
      }
      return cookieValue;
    },

    remove(
      name: string,
      domain?: string,
      path?: string,
      secure?: boolean
    ): void {
      this.set(name, "", new Date(0), domain, path, secure);
    },
  },

  data: {
    set(table: string, settings: any): void {
      const _set = JSON.stringify(settings);
      localStorage.setItem(table, _set);
    },
    get(table: string): any {
      const data = localStorage.getItem(table);
      try {
        return JSON.parse(data as string);
      } catch (err) {
        return null;
      }
    },
    remove(table: string): void {
      localStorage.removeItem(table);
    },
    clear(): void {
      localStorage.clear();
    },
  },

  session: {
    set(table: string, settings: any): void {
      const _set = JSON.stringify(settings);
      sessionStorage.setItem(table, _set);
    },
    get(table: string): any {
      const data = sessionStorage.getItem(table);
      try {
        return JSON.parse(data as string);
      } catch (err) {
        return null;
      }
    },
    remove(table: string): void {
      sessionStorage.removeItem(table);
    },
    clear(): void {
      sessionStorage.clear();
    },
  },

  screen(element: HTMLElement): void {
    // 检查是否处于全屏状态
    const isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    if (isFullscreen) {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } else {
      // 进入全屏
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    }
  },

  objCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  },

  dateFormat(
    date: Date | string | number,
    fmt: string = "yyyy-MM-dd hh:mm:ss"
  ): string {
    date = new Date(date);
    const o: Record<string, number> = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? String(o[k])
            : ("00" + o[k]).substr(String(o[k]).length)
        );
      }
    }
    return fmt;
  },

  groupSeparator(num: number | string): string {
    let str = String(num);
    if (!str.includes(".")) {
      str += ".";
    }
    return str
      .replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => $1 + ",")
      .replace(/\.$/, "");
  },

  http: {
    stringify(data: Record<string, any>): string {
      let result = "";
      for (const key in data) {
        result +=
          encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
      }
      return result.slice(0, result.length - 1);
    },
  },
};

export default tool;
