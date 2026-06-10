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

    await user.click(screen.getByRole('button', { name: /KYC 失败/i }))
    expect(screen.getByText('KYC 失败说明与补件')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /提交工单/i }))
    expect(within(screen.getByLabelText('action audit')).getByText(/ticket/))
      .toBeInTheDocument()
  })
})
