import { fetch, Response } from "undici";

export default class Fetch {
  private static async process<type>(res: Response): Promise<type> {
    if (res.status !== 200) throw new Error(`${res.status} ${res.statusText}`);
    try {
      const json = (await res.json()) as type;

      return json;
    } catch (err) {
      throw err;
    }
  }

  public static get<type, data = unknown>(
    route: string,
    body?: data
  ): Promise<type> {
    return new Promise((resolve, reject) => {
      fetch(route, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(body),
      }).then((res) => {
        this.process<type>(res)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      });
    });
  }

  public static post<type, data = unknown>(
    route: string,
    body?: data
  ): Promise<type> {
    return new Promise((resolve, reject) => {
      fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(body),
      }).then((res) => {
        this.process<type>(res)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      });
    });
  }
}
