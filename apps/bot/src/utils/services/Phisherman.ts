import axios from "axios";

class Phisherman {
  private static readonly TOKEN = `Bearer :${process.env.PHISHERMAN_TOKEN}`;

  public static async checkDomain(domain: string): Promise<boolean> {
    const res = await axios.get(
      `https://api.phisherman.gg/v2/domains/check/${domain}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.TOKEN,
        },
      }
    );

    const json = await res.data;

    return json.verifiedPhish;
  }
}
