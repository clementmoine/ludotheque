import { Item } from '@prisma/client';

// Serp Wow : 100 requests / month
export class SerpWow {
  name = 'Serp Wow';
  url = 'https://api.serpwow.com';
  api_key = process.env.SERP_WOW_API_KEY || '';

  // Check remaining credits
  available(): Promise<boolean> {
    const url = new URL(`${this.url}/account`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (!response?.request_info?.success) {
            return Promise.reject('Request failed');
          }

          return response;
        })
        // Check the credits
        .then((response) => {
          if (response?.account_info?.credits_remaining === 0) {
            return Promise.reject('No remaining credits');
          }

          return true;
        })
        .catch(() => {
          return false;
        })
    );
  }

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    if (await !this.available()) {
      return Promise.reject(`${this.name} unavailable`);
    }

    const url = new URL(`${this.url}/search`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
      q: gtin,
      gl: 'fr',
      hl: 'fr',
      output: 'json',
      search_type: 'shopping',
      google_domain: 'google.fr',
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (!response?.request_info?.success) {
            return Promise.reject('Request failed');
          }

          return response;
        })
        // Serialize the item
        .then((response) => {
          if (response?.shopping_results?.length) {
            const product = response.shopping_results.find((product: any) => product?.title?.length);

            if (product) {
              return {
                title: product.title,
                gtin,
              };
            }
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}

// Zen Serp : 50 requests / month
export class ZenSerp {
  name = 'Zen Serp';
  url = 'https://app.zenserp.com/api/v2';
  api_key = process.env.ZEN_SERP_API_KEY || '';

  // Check remaining credits
  available(): Promise<boolean> {
    const url = new URL(`${this.url}/status`);

    url.search = new URLSearchParams({
      apikey: this.api_key,
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the credits
        .then((response) => {
          if (response?.remaining_requests === 0) {
            return Promise.reject('No remaining credits');
          }

          return true;
        })
        .catch(() => {
          return false;
        })
    );
  }

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    if (await !this.available()) {
      return Promise.reject(`${this.name} unavailable`);
    }

    const url = new URL(`${this.url}/search`);

    url.search = new URLSearchParams({
      apikey: this.api_key,
      q: gtin,
      gl: 'FR',
      hl: 'fr',
      tbm: 'shop',
      search_engine: 'google.fr',
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Serialize the item
        .then((response) => {
          if (response?.shopping_results?.length) {
            const product = response.shopping_results.find((product: any) => product?.title?.length);

            if (product) {
              return {
                title: product.title,
                gtin,
              };
            }
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}

// Value Serp : 100 requests / month
export class ValueSerp {
  name = 'Value Serp';
  url = 'https://api.valueserp.com';
  api_key = process.env.VALUE_SERP_API_KEY || '';

  // Check remaining credits
  available(): Promise<boolean> {
    const url = new URL(`${this.url}/account`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (!response?.request_info?.success) {
            return Promise.reject('Request failed');
          }

          return response;
        })
        // Check the credits
        .then((response) => {
          if (response?.account_info?.topup_credits_remaining === 0) {
            return Promise.reject('No remaining credits');
          }

          return true;
        })
        .catch(() => {
          return false;
        })
    );
  }

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    if (await !this.available()) {
      return Promise.reject(`${this.name} unavailable`);
    }

    const url = new URL(`${this.url}/search`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
      q: gtin,
      gl: 'fr',
      hl: 'fr',
      output: 'json',
      search_type: 'shopping',
      google_domain: 'google.fr',
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (!response?.request_info?.success) {
            return Promise.reject('Request failed');
          }

          return response;
        })
        // Serialize the item
        .then((response) => {
          if (response?.shopping_results?.length) {
            const product = response.shopping_results.find((product: any) => product?.title?.length);

            if (product) {
              return {
                title: product.title,
                gtin,
              };
            }
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}

// Scale Serp : 100 requests / month
export class ScaleSerp {
  name = 'Scale Serp';
  url = 'https://api.scaleserp.com';
  api_key = process.env.SCALE_SERP_API_KEY || '';

  // Check remaining credits
  available(): Promise<boolean> {
    const url = new URL(`${this.url}/account`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (!response?.request_info?.success) {
            return Promise.reject('Request failed');
          }

          return response;
        })
        // Check the credits
        .then((response) => {
          if (response?.account_info?.topup_credits_remaining === 0) {
            return Promise.reject('No remaining credits');
          }

          return true;
        })
        .catch(() => {
          return false;
        })
    );
  }

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    if (await !this.available()) {
      return Promise.reject(`${this.name} unavailable`);
    }

    const url = new URL(`${this.url}/search`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
      q: gtin,
      gl: 'fr',
      hl: 'fr',
      output: 'json',
      search_type: 'shopping',
      google_domain: 'google.fr',
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (!response?.request_info?.success) {
            return Promise.reject('Request failed');
          }

          return response;
        })
        // Serialize the item
        .then((response) => {
          if (response?.shopping_results?.length) {
            const product = response.shopping_results.find((product: any) => product?.title?.length);

            if (product) {
              return {
                title: product.title,
                gtin,
              };
            }
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}

// Serp API : 100 requests / month
export class SerpAPI {
  name = 'Serp API';
  url = 'https://serpapi.com';
  api_key = process.env.SERP_API_KEY || '';

  // Check remaining credits
  available(): Promise<boolean> {
    const url = new URL(`${this.url}/account`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the credits
        .then((response) => {
          if (response?.plan_searches_left === 0) {
            return Promise.reject('No remaining credits');
          }

          return true;
        })
        .catch(() => {
          return false;
        })
    );
  }

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    if (await !this.available()) {
      return Promise.reject(`${this.name} unavailable`);
    }

    const url = new URL(`${this.url}/search.json`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
      q: gtin,
      gl: 'fr',
      hl: 'fr',
      tbm: 'shop',
      engine: 'google',
      google_domain: 'google.fr',
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (response?.error) {
            return Promise.reject('Something went wrong');
          }

          return response;
        })
        // Serialize the item
        .then((response) => {
          if (response?.shopping_results?.length) {
            const product = response.shopping_results.find((product: any) => product?.title?.length);

            if (product) {
              return {
                title: product.title,
                gtin,
              };
            }
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}

// SerpStack : 100 requests / month
export class SerpStack {
  name = 'Serp Stack';
  url = 'http://api.serpstack.com';
  api_key = process.env.SERP_STACK_API_KEY || '';

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    const url = new URL(`${this.url}/search`);

    url.search = new URLSearchParams({
      access_key: this.api_key,
      gl: 'fr',
      hl: 'fr',
      query: gtin,
      output: 'json',
      type: 'shopping',
      engine: 'google',
      device: 'desktop',
      google_domain: 'google.fr',
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (response?.error) {
            return Promise.reject('Something went wrong');
          }

          return response;
        })
        // Serialize the item
        .then((response) => {
          if (response?.shopping_results?.length) {
            const product = response.shopping_results.find((product: any) => product?.title?.length);

            if (product) {
              return {
                title: product.title,
                gtin,
              };
            }
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}

// ScrapingBee : 50 requests
export class ScrapingBee {
  name = 'Scraping Bee';
  url = 'http://app.scrapingbee.com/api/v1';
  api_key = process.env.SCRAPING_BEEP_API_KEY || '';

  // Check remaining credits
  available(): Promise<boolean> {
    const url = new URL(`${this.url}/usage`);

    url.search = new URLSearchParams({
      api_key: this.api_key,
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the credits
        .then((response) => {
          if ((response?.max_api_credit || 0) - (response?.max_api_credit || 0) === 0) {
            return Promise.reject('No remaining credits');
          }

          return true;
        })
        .catch(() => {
          return false;
        })
    );
  }

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    if (await !this.available()) {
      return Promise.reject(`${this.name} unavailable`);
    }

    const query_url = new URL('https://www.google.com/search');

    query_url.search = new URLSearchParams({
      q: gtin,
      tbm: 'shop',
      gl: 'fr',
      hl: 'fr',
    }).toString();

    const url = new URL(this.url);

    url.search = new URLSearchParams({
      api_key: this.api_key,
      url: query_url.toString(),
      block_ads: 'true',
      custom_google: 'true',
      block_resources: 'true',
      device: 'desktop',
      extract_rules: JSON.stringify({ key_name: '.sh-pr__product-results-grid > .sh-dgr__grid-result h4' }),
      json_response: 'true',
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => {
          return response.json();
        })
        // Check the response
        .then((response) => {
          if (!response?.body) {
            return Promise.reject('Something went wrong');
          }

          return response;
        })
        // Serialize the item
        .then((response) => {
          if (response?.body?.key_name) {
            return {
              title: response?.body?.key_name,
              gtin,
            };
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}

// AvesAPI : 1000 requests
export class AvesAPI {
  name = 'AvesAPI';
  url = 'https://api.avesapi.com';
  api_key = process.env.AVES_API_KEY || '';

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    const url = new URL(`${this.url}/search`);

    url.search = new URLSearchParams({
      apikey: this.api_key,
      gl: 'fr',
      hl: 'fr',
      num: '10',
      type: 'web',
      query: gtin,
      output: 'json',
      device: 'desktop',
      google_domain: 'google.fr',
    }).toString();

    return (
      fetch(url)
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (response?.error || !response.request?.success) {
            return Promise.reject('Something went wrong');
          }

          return response;
        })
        // Serialize the item
        .then((response) => {
          if (response?.result?.organic_results?.length) {
            const product = response.result.organic_results.find((product: any) => product?.title?.length);

            if (product) {
              return {
                title: product.title,
                gtin,
              };
            }
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}

// DataForSEO : 1000 requests
export class DataForSEO {
  name = 'DataForSEO';
  url = 'https://api.dataforseo.com/v3/serp/google/organic/live/advanced';
  api_key = process.env.DATA_FOR_SEO_API_KEY || '';

  /**
   * Search an item from the GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {Promise<Partial<Item> | undefined>}
   */
  async search(gtin: string): Promise<Partial<Item> | undefined> {
    return (
      fetch(this.url, {
        body: JSON.stringify([
          {
            keyword: gtin,
            location_code: '2250',
            language_code: 'fr',
            device: 'desktop',
            os: 'windows',
          },
        ]),
        method: 'POST',
        headers: {
          Authorization: `Basic ${this.api_key}`,
          'Content-Type': 'application/json',
        },
      })
        // Get JSON response
        .then((response) => response.json())
        // Check the response
        .then((response) => {
          if (response?.status_message !== 'Ok.') {
            return Promise.reject('Something went wrong');
          }

          return response;
        })
        // Serialize the item
        .then((response) => {
          if (response?.tasks?.[0]?.result) {
            const product = response.tasks[0].result.reduce(
              (acc: { title: string } | undefined, result: any) => {
                if (!acc) {
                  acc = result.items?.find((item: any) => item?.title?.length);
                }

                return acc;
              },
              undefined
            );

            if (product) {
              return {
                title: product.title,
                gtin,
              };
            }
          }
        })
        .catch(() => {
          return undefined;
        })
    );
  }
}
