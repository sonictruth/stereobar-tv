export default class Spotify {
  redirectURI =
    document.location.protocol +
    '//' +
    document.location.host +
    document.location.pathname;
  tokenStorageURL = 'https://www.sonicpix.ro/stereobar/token.php';
  tokenApiURL = 'https://accounts.spotify.com/api/token';
  spotifyApiUrl = 'https://api.spotify.com/v1';
  authURL = 'https://accounts.spotify.com/authorize?';
  clientID = '71134425a13544afa5442ff15c74656d';
  clientSecret = 'dc30a235851a4ca58817fc15b46cfbd9';
  state = 'random123';
  scope = ['user-read-currently-playing'];
  refreshToken = '';

  private async getTokenFromStorage() {
    const response = await fetch(`${this.tokenStorageURL}?cmd=get`);
    return await response.text();
  }

  private async setTokenToStorage(token: string, password: string) {
    const response = await fetch(
      `${this.tokenStorageURL}?cmd=set&token=${token}&password=${password}`,
    );
    return await response.text();
  }

  async saveRefresToken(code: string, password: string) {
    const data = {
      code: code,
      redirect_uri: this.redirectURI,
      grant_type: 'authorization_code',
    };

    const tokenRequestResponse = await this.tokenRequest(data);
    await this.setTokenToStorage(tokenRequestResponse.refresh_token, password);
  }

  private async getAccessToken(refreshToken: string) {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    const response = await this.tokenRequest(data);
    return response.access_token;
  }

  async getCurrentlyPlayingSong() {
    return this.apiRequestWithToken('/me/player/currently-playing');
  }

  private async apiRequestWithToken(path: string) {
    const accessToken = await this.getAccessToken(this.refreshToken);
    return this.apiRequest(path, accessToken);
  }

  private async apiRequest(path: string, accessToken: string) {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const response = await fetch(this.spotifyApiUrl + path, {
      headers,
    });
    let responseData = null;
    if (response.status === 200) {
      responseData = await response.json();
    }
    return responseData;
  }

  getLoginURL() {
    const query: any = {
      response_type: 'code',
      client_id: this.clientID,
      scope: this.scope,
      redirect_uri: this.redirectURI,
      state: this.state,
    };
    return this.authURL + new URLSearchParams(query).toString();
  }

  async isValidRefreshToken() {
    const refreshToken = await this.getTokenFromStorage();
    if (refreshToken === '') {
      throw 'Invalid token';
    } else {
      this.refreshToken = refreshToken;
      await this.getAccessToken(this.refreshToken);
    }
    return true;
  }

  private async tokenRequest(data: any) {
    const auth = btoa(this.clientID + ':' + this.clientSecret);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: 'Basic ' + auth,
    };
    const body = new URLSearchParams(data).toString();
    const response = await fetch(this.tokenApiURL, {
      method: 'POST',
      headers,
      body,
    });
    const responseData = await response.json();
    if (response.status !== 200) {
      throw responseData.error;
    }
    return responseData;
  }
}
