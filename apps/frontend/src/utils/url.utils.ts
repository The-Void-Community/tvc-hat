const urlPattern =
  /^(?:(?<protocol>[^:\/?#]+):)?(?:\/\/(?:(?<username>[^:@]+)(?::(?<password>[^@]+))?@)?(?<hostname>[^:\/?#]+)(?::(?<port>\d+))?)?(?<pathname>\/[^?#]*)?(?:\?(?<search>[^#]*))?(?:#(?<hash>.*))?/;

export interface UrlType {
  origin: string;
  protocol: string;
  username: string | null;
  password: string | null;
  hostname: string;
  port: string | null;
  pathname: string;
  search: string | null;
  hash: string | null;

  host: string;
  href: string;
  query: Map<string, string>;
}

export type Nullable<T extends object> = {
  [P in keyof T]: T[P] | null;
};

export class Url implements UrlType {
  private static readonly nullableProperties = [
    "username",
    "password",
    "search",
    "hash",
    "port",
  ];
  private _data: Omit<UrlType, "href">;

  public static queryFromString(
    query: string | undefined,
  ): Map<string, string> {
    if (!query) {
      return new Map();
    }

    return new Map<string, string>(
      query.split("&").map((value) => {
        const queryData = value.split("=");
        if (queryData.length !== 2) {
          throw new Error("Bad query");
        }

        return queryData as [string, string];
      }),
    );
  }

  public static fromString(url: string) {
    const match = urlPattern.exec(url);
    if (!match) {
      throw new Error("Bad url string");
    }

    const groups = match.groups;
    if (!groups) {
      throw new Error("Bad grouping");
    }

    const host = groups.port
      ? `${groups.hostname}:${groups.port}`
      : groups.hostname;

    const parsed: UrlType = {
      protocol: groups.protocol,
      username: groups.username || null,
      password: groups.password || null,
      hostname: groups.hostname,
      port: groups.port || null,
      host: host,
      pathname: groups.pathname || "/",
      search: groups.search || null,
      query: this.queryFromString(groups.search),
      hash: groups.hash || null,
      href: url,
      origin: groups.protocol ? `${groups.protocol}://${host}` : `//${host}`,
    };

    return parsed;
  }

  public constructor(data: Url | UrlType | string) {
    if (typeof data === "string") {
      this._data = Url.fromString(data);
    } else {
      this._data = data;
    }
  }

  public overwrite(url: Omit<Partial<Nullable<UrlType>>, "origin" | "href">) {
    this.paste("hash", url.hash);
    this.paste("password", url.password);
    this.paste("username", url.username);
    this.paste("pathname", url.pathname);
    this.paste("protocol", url.protocol);

    if (url.host) {
      const [hostname, port] = url.host.split(":");

      this.paste("hostname", hostname);
      this.paste("port", port);
      this.paste("host", url.host);
      this.paste(
        "origin",
        url.protocol
          ? `${url.protocol}://${url.host}`
          : `${this._data.protocol}://${url.host}`,
      );
    }

    if (url.hostname) {
      this.changeHost({ hostname: url.hostname });
    }

    if (url.port !== undefined) {
      this.changeHost({ port: url.port });
    }

    if (url.search === null) {
      this.paste("search", null);
      this._data.query = new Map();
    } else if (url.search !== undefined) {
      this.paste("search", url.search);
      this._data.query = Url.queryFromString(url.search);
    }

    if (url.query === null) {
      this.paste("search", null);
      this._data.query = new Map();
    } else if (url.query !== undefined) {
      this.paste(
        "search",
        Array.from(url.query.entries())
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&"),
      );
      this._data.query = url.query;
    }

    return this;
  }

  public overwriteAndCreate(
    url: Omit<Partial<Nullable<UrlType>>, "origin" | "href">,
  ) {
    return new Url(this.raw).overwrite(url);
  }

  public toString(): string {
    const {
      protocol,
      username,
      password,
      hostname,
      port,
      pathname,
      search,
      hash,
    } = this._data;

    const authorization: string =
      username && password ? `${username}:${password}@` : "";
    const host = this.buildHost(hostname, port);
    const searchString = search ? `?${search}` : "";
    const hashString = hash ? `#${hash}` : "";

    const output = `${protocol}://${authorization}${host}${pathname}${searchString}${hashString}`;

    return output;
  }

  private changeHost({
    hostname,
    port,
  }: Partial<Nullable<Pick<UrlType, "hostname" | "port">>>) {
    const host = this.buildHost(hostname!, port);

    this.paste("hostname", hostname);
    this.paste("port", port);
    this.paste("host", host);
    this.paste("origin", `${this._data.protocol}://${host}`);
  }

  private buildHost(
    hostname: string | undefined,
    port: string | undefined | null,
  ) {
    if (hostname === null) {
      throw new Error("hostname can not be null");
    }

    const requiredHostname = hostname || this._data.hostname;
    const maybePort = port === null ? null : port || this._data.port;

    return maybePort === null
      ? requiredHostname
      : `${requiredHostname}:${maybePort}`;
  }

  private paste(
    key: keyof Omit<UrlType, "query">,
    value: string | undefined | null,
  ) {
    if (value === undefined) {
      return;
    }

    if (typeof value !== "string") {
      if (!Url.nullableProperties.includes(key)) {
        throw new Error("Can not paste null to string");
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._data[key] = null;
      return;
    }

    if (key === "href") {
      return;
    }

    this._data[key] = value;
  }

  public get origin(): string {
    return this._data.origin;
  }

  public get protocol(): string {
    return this._data.protocol;
  }

  public get username(): string | null {
    return this._data.username;
  }

  public get password(): string | null {
    return this._data.password;
  }

  public get hostname(): string {
    return this._data.hostname;
  }

  public get port(): string | null {
    return this._data.port;
  }

  public get pathname(): string {
    return this._data.pathname;
  }

  public get search(): string | null {
    return this._data.search;
  }

  public get hash(): string | null {
    return this._data.hash;
  }

  public get host(): string {
    return this._data.host;
  }

  public get href(): string {
    return this.toString();
  }

  public get query(): Map<string, string> {
    return this._data.query;
  }

  public get raw(): UrlType {
    return {
      ...this._data,
      href: this.toString(),
    };
  }
}
