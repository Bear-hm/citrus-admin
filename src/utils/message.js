/**
 * @Author: xiong x1253780359@outlook.com
 * @Date: 2026-04-20
 * @LastEditors: xiong x1253780359@outlook.com
 * @LastEditTime: 2026-04-20
 * @FilePath: \citrus-admin\src\utils\message.js
 * @Description: 统一封装 ElMessage 消息提示，支持最大并发数限制、队列排队
 *               全局挂载为 $msg，支持 this.$msg 或组件中直接 import 调用
 */
import { ElMessage } from 'element-plus'

const MAX_VISIBLE = 2

const queue = []
let visibleCount = 0

function nextInQueue() {
  if (queue.length === 0 || visibleCount >= MAX_VISIBLE) return
  const next = queue.shift()
  showMessage(next)
}

function showMessage(options) {
  if (visibleCount >= MAX_VISIBLE) {
    queue.push(options)
    return
  }

  visibleCount++

  ElMessage({
    ...options,
    onClose: () => {
      visibleCount--
      nextInQueue()
    },
  })
}

const message = {
  /**
   * 成功提示
   * @param {string} msg 提示文本
   * @param {number} duration 显示时长(ms)，默认 3000
   */
  success(msg, duration = 3000) {
    showMessage({ type: 'success', message: msg, duration })
  },

  /**
   * 错误提示
   * @param {string} msg 提示文本
   * @param {number} duration 默认 5000
   */
  error(msg, duration = 5000) {
    showMessage({ type: 'error', message: msg, duration })
  },

  /**
   * 警告提示
   * @param {string} msg 提示文本
   * @param {number} duration 默认 4000
   */
  warning(msg, duration = 4000) {
    showMessage({ type: 'warning', message: msg, duration })
  },

  /**
   * 普通消息提示
   * @param {string} msg 提示文本
   * @param {number} duration 默认 3000
   */
  info(msg, duration = 3000) {
    showMessage({ type: 'info', message: msg, duration })
  },

  /**
   * 关闭所有当前显示的通知
   */
  closeAll() {
    ElMessage.closeAll()
    queue.length = 0
    visibleCount = 0
  },
}

export default message
