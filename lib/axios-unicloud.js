/**
 * axios-unicloud  v0.1.0 | by 落魄实习生(Mouxan) 2020-09-04 17:30:34
 * 仅供学习交流，如作它用所承受的法律责任一概与作者无关
 * 使用axios-unicloud开发扩展与插件时，请注明基于axios-unicloud开发
 * 说明：
 *      该插件基于axios基础上进行自定义adapter封装
 *      云函数模式single为单一云函数，many为多云函数
 *      多云函数不需要配baseCloud基础云函数
 *      当配置了baseCloud没配置module时，自动匹配为单一云函数，若二者都没配默认为uni.request请求
 *      uni.request我暂时没进行封装，如需使用请自行扩展
 */
import defaults from 'axios/lib/defaults'
import axios from 'axios'
import createError from 'axios/lib/core/createError'
import settle from 'axios/lib/core/settle'
import buildUrl from 'axios/lib/helpers/buildURL'
import {
	isObject,
	isString
} from 'axios/lib/utils'

/**
 * 云函数请求
 * @param {Object} name
 * @param {Object} data
 */
function uniCloudRequest(name, data) {
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name,
			data,
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
				reject(error);
			}
		})
	})
}

/**
 * 其他请求模式，如uni.request
 * 请自行封装
 * @param {Object} name
 * @param {Object} data
 */
function UniRequest(config) {
	return new Promise((resolve, reject) => {
		const url = buildUrl(config.url, config.params, config.paramsSerializer)
		const method = (isString(config.method) ? config.method : 'GET').toUpperCase()
		const header = isObject(config.headers) ? config.headers : {}
		const data = (method === 'post' || method === 'put' || method === 'patch' || method === 'POST' || method === 'PUT' ||
			method === 'PATCH') ? JSON.parse(config.data) : config.params;
		uni.reques({
			url,
			method,
			header,
			data,
			responseType: config.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
			dataType: config.responseType === 'json' ? 'json' : config.responseType,
			success(res) {
				settle(resolve, reject, {
					data: res.data,
					status: res.statusCode,
					statusText: '',
					headers: res.header,
					config,
					request
				})
			},
			fail: () => {
				const error = createError('网络错误', config, undefined, request)
				reject(error)
			}
		})
	})
}

/**
 * 自定义请求封装
 * @param {Object} config
 */
defaults.adapter = function adapter(config) {
	if (config.module == 'many') {
		var name = config.url
		var method = config.method
		var data = (method === 'post' || method === 'put' || method === 'patch' || method === 'POST' || method === 'PUT' ||
			method === 'PATCH') ? JSON.parse(config.data) : config.params;
		return uniCloudRequest(name, Object.assign(data, {
			method
		}))
	} else if (config.baseCloud) {
		var name = config.baseCloud
		var method = config.method
		var url = config.url
		var data = (method === 'post' || method === 'put' || method === 'patch' || method === 'POST' || method === 'PUT' ||
			method === 'PATCH') ? JSON.parse(config.data) : config.params;
		return uniCloudRequest(name, {
			url,
			method,
			data
		})
	} else {
		return UniRequest(config)
	}
};

module.exports = axios;

// 允许在TypeScript中使用默认导入语法
module.exports.default = axios;
