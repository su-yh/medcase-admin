import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestMock = vi.fn()

vi.mock('@/utils/adminRequest', () => ({
  default: requestMock
}))

describe('supplier api', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('uses supplier management endpoints', async () => {
    const {
      listSupplier,
      getSupplier,
      addSupplier,
      updateSupplier,
      updateSupplierStatus,
      listSupplierUsers,
      listSupplierUserCases
    } = await import('@/api/biz/supplier')

    listSupplier({ pageNo: 1, pageSize: 10 })
    getSupplier(1)
    addSupplier({ name: '供应商A' })
    updateSupplier({ supplierId: 1, name: '供应商B' })
    updateSupplierStatus(1, '1')
    listSupplierUsers(1, { pageNo: 1, pageSize: 10 })
    listSupplierUserCases(1, 12, { pageNo: 1, pageSize: 10 })

    expect(requestMock).toHaveBeenNthCalledWith(1, {
      url: '/biz/supplier/list',
      method: 'get',
      params: { pageNo: 1, pageSize: 10 }
    })
    expect(requestMock).toHaveBeenNthCalledWith(2, {
      url: '/biz/supplier/1',
      method: 'get'
    })
    expect(requestMock).toHaveBeenNthCalledWith(3, {
      url: '/biz/supplier',
      method: 'post',
      data: { name: '供应商A' }
    })
    expect(requestMock).toHaveBeenNthCalledWith(4, {
      url: '/biz/supplier',
      method: 'put',
      data: { supplierId: 1, name: '供应商B' }
    })
    expect(requestMock).toHaveBeenNthCalledWith(5, {
      url: '/biz/supplier/1/status',
      method: 'put',
      data: { status: '1' }
    })
    expect(requestMock).toHaveBeenNthCalledWith(6, {
      url: '/biz/supplier/1/users',
      method: 'get',
      params: { pageNo: 1, pageSize: 10 }
    })
    expect(requestMock).toHaveBeenNthCalledWith(7, {
      url: '/biz/supplier/1/users/12/cases',
      method: 'get',
      params: { pageNo: 1, pageSize: 10 }
    })
  })
})
