/*
  该插件基于axios基础上进行自定义adapter封装
*/
import defaults from 'axios/lib/defaults'
import axios from 'axios'
import createError from 'axios/lib/core/createError'
import settle from 'axios/lib/core/settle'

defaults.adapter = function adapter(config) {
	return new Promise((resolve, reject) => {
		if (config.baseCloud) {
			var name = config.baseCloud
			var method = config.method
			var url = config.url
			var data = (method === 'post' || method === 'put' || method === 'patch' || method === 'POST' || method === 'PUT' ||
				method === 'PATCH') ? JSON.parse(config.data) : config.params;
			uniCloud.callFunction({
				name,
				data: {
					url,
					method,
					data
				},
				success(res) {
					settle(resolve, reject, {
						data: res.result,
						header: res.header,
						success: res.success,
						config: '',
						requestId: res.requestId
					})
				},
				fail() {
					const error = createError('请求失败')
					reject(error)
				}
			})
		} else {
			const error = createError('请配置基础云函数')
			reject(error)
		}
	})
};

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
