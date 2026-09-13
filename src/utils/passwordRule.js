const DEFAULT_PASSWORD_RULE = {
  pattern: /^[^<>"'|\\]+$/,
  message: '密码不能包含非法字符：< > " \' \\ |'
}

export function usePasswordRule() {
  // 默认密码校验
  const pwdValidator = [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须介于 6 和 20 之间', trigger: 'blur' },
    { pattern: DEFAULT_PASSWORD_RULE.pattern, message: DEFAULT_PASSWORD_RULE.message, trigger: 'blur' }
  ]

  // 校验prompt的inputValidator函数
  const pwdPromptValidator = (value) => {
    if (!value || value.length < 6 || value.length > 20) {
      return '密码长度必须介于 6 和 20 之间'
    }
    if (!DEFAULT_PASSWORD_RULE.pattern.test(value)) {
      return DEFAULT_PASSWORD_RULE.message
    }
  }

  // 个人中心密码校验
  const infoPwdValidator = [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '新密码长度必须介于 6 和 20 之间', trigger: 'blur' },
    { pattern: DEFAULT_PASSWORD_RULE.pattern, message: DEFAULT_PASSWORD_RULE.message, trigger: 'blur' }
  ]

  // 注册页面密码校验
  const registerPwdValidator = [
    { required: true, message: '请输入您的密码', trigger: 'blur' },
    { min: 6, max: 20, message: '用户密码长度必须介于 6 和 20 之间', trigger: 'blur' },
    { pattern: DEFAULT_PASSWORD_RULE.pattern, message: DEFAULT_PASSWORD_RULE.message, trigger: 'blur' }
  ]

  return {
    pwdValidator,
    infoPwdValidator,
    pwdPromptValidator,
    registerPwdValidator
  }
}
