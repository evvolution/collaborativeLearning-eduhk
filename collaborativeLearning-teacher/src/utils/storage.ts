import Cookies from 'js-cookie';

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
	// 设置永久缓存
	set(key: string, val: any) {
		window.localStorage.setItem(key, JSON.stringify(val));
	},
	// 获取永久缓存
	get(key: string) {
		let json: any = window.localStorage.getItem(key);
		return JSON.parse(json);
	},
	// 移除永久缓存
	remove(key: string) {
		window.localStorage.removeItem(key);
	},
	// 移除全部永久缓存
	clear() {
		window.localStorage.clear();
	},

  // 设置23小时缓存
  set23hours(key: string, val: any) {
    let seconds = 64800
    let expires = new Date(<any>new Date() * 1 + seconds * 1000)
    return Cookies.set(key, val, { expires })
  }
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
	// 设置临时缓存
	set(key: string, val: any) {
		if (key === 'te_token' || key === 'username'){
			const expirationTime = new Date();
      expirationTime.setTime(expirationTime.getTime() + 2 * 60 * 60 * 1000); // 2小时后过期
      return Cookies.set(key, val, { expires: expirationTime });
		} 
		window.sessionStorage.setItem(key, JSON.stringify(val));
	},
	// 获取临时缓存
	get(key: string) {
		if (key === 'te_token' || key === 'username') return Cookies.get(key);
		let json: any = window.sessionStorage.getItem(key);
		return JSON.parse(json);
	},
	// 移除临时缓存
	remove(key: string) { 
		if (key === 'te_token' || key === 'username') return Cookies.remove(key);
		window.sessionStorage.removeItem(key);
	},
	// 移除全部临时缓存
	clear() {
		Cookies.remove('te_token');
		Cookies.remove('username');

		window.sessionStorage.clear();
	},
};
