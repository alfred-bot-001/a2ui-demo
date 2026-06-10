import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the default withdrawal support surface', () => {
    render(<App />)

    expect(screen.getByText('USDT 提现延迟排查')).toBeInTheDocument()
    expect(screen.getByText('状态时间线')).toBeInTheDocument()
    expect(screen.getByText('重新触发扫描')).toBeInTheDocument()
  })

  it('switches scenarios and records action audit events', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /KYC 补件助手/i }))
    expect(screen.getByText('身份认证需要补充材料')).toBeInTheDocument()
    expect(screen.getByText('重新上传前检查')).toBeInTheDocument()
    expect(screen.getByText('可接受的材料示例')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /请求人工复核/i }))
    expect(
      within(screen.getByLabelText('action audit')).getByText(
        /kyc.request_manual_review/,
      ),
    ).toBeInTheDocument()
  })
})
