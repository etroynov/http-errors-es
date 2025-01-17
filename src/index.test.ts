import assert from 'node:assert/strict'
import { types } from 'node:util'

import { it, describe, before } from 'node:test'

import createError from '.'

process.env.NO_DEPRECATION = 'http-errors'

describe('createError(status)', function () {
  it('should create error object', function () {
    assert.ok(types.isNativeError(createError(500)))
  })

  describe('when status 300', function () {
    let error: { message: unknown; name: unknown; status: unknown; statusCode: unknown }

    before(function () {
      error = createError(300)
    })

    it('should have "message" property of "Multiple Choices"', function () {
      assert.strictEqual(error.message, 'Multiple Choices')
    })

    it('should have "name" property of "Error"', function () {
      assert.strictEqual(error.name, 'Error')
    })

    it('should have "status" property of 300', function () {
      assert.strictEqual(error.status, 300)
    })

    it('should have "statusCode" property of 300', function () {
      assert.strictEqual(error.statusCode, 300)
    })
  })

  describe('when status 404', function () {
    let error: { message: unknown; name: unknown; status: unknown; statusCode: unknown }

    before(function () {
      error = createError(404)
    })

    it('should have "message" property of "Not Found"', function () {
      assert.strictEqual(error.message, 'Not Found')
    })

    it('should have "name" property of "NotFoundError"', function () {
      assert.strictEqual(error.name, 'NotFoundError')
    })

    it('should have "status" property of 404', function () {
      assert.strictEqual(error.status, 404)
    })

    it('should have "statusCode" property of 404', function () {
      assert.strictEqual(error.statusCode, 404)
    })
  })

  describe('when status unknown 4xx', function () {
    let error: { message: unknown; name: unknown; status: unknown; statusCode: unknown }
    before(function () {
      error = createError(499)
    })

    it('should have "message" property of "Bad Request"', function () {
      assert.strictEqual(error.message, 'Bad Request')
    })

    it('should have "name" property of "BadRequestError"', function () {
      assert.strictEqual(error.name, 'BadRequestError')
    })

    it('should have "status" property with code', function () {
      assert.strictEqual(error.status, 499)
    })

    it('should have "statusCode" property with code', function () {
      assert.strictEqual(error.statusCode, 499)
    })
  })

  describe('when status unknown 5xx', function () {
    let error: { message: unknown; name: unknown; status: unknown; statusCode: unknown }

    before(function () {
      error = createError(599)
    })

    it('should have "message" property of "Internal Server Error"', function () {
      assert.strictEqual(error.message, 'Internal Server Error')
    })

    it('should have "name" property of "InternalServerError"', function () {
      assert.strictEqual(error.name, 'InternalServerError')
    })

    it('should have "status" property with code', function () {
      assert.strictEqual(error.status, 599)
    })

    it('should have "statusCode" property with code', function () {
      assert.strictEqual(error.statusCode, 599)
    })
  })
})

describe('createError(status, message)', function () {
  let error: unknown

  before(function () {
    error = createError(404, 'missing')
  })

  it('should create error object', function () {
    assert.ok(types.isNativeError(error))
  })

  it('should have "message" property with message', function () {
    assert.strictEqual(error.message, 'missing')
  })

  it('should have "status" property with status', function () {
    assert.strictEqual(error.status, 404)
  })

  it('should have "statusCode" property with status', function () {
    assert.strictEqual(error.statusCode, 404)
  })
})

describe('createError.isHttpError(val)', function () {
  describe('when val is undefined', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError(undefined), false)
    })
  })

  describe('when val is null', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError(null), false)
    })
  })

  describe('when val is a number', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError(42), false)
    })
  })

  describe('when val is a string', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError('foobar'), false)
    })
  })

  describe('when val is an empty object', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError({}), false)
    })
  })

  describe('when val is a plain Error', function () {
    it('should return false', function () {
      assert.strictEqual(createError.isHttpError(new Error()), false)
    })
  })

  describe('when val is an instance of HttpError', function () {
    it('should return true', function () {
      const err = createError(500)

      assert.ok(err instanceof createError.HttpError)
      assert.strictEqual(createError.isHttpError(err), true)
    })
  })

  describe('when val is an Error passed to createError', function () {
    it('should return true', function () {
      const err = createError(500, new Error())

      assert.ok(!(err instanceof createError.HttpError))
      assert.strictEqual(createError.isHttpError(err), true)
    })
  })
})

describe('HTTP Errors', function () {
  it('createError(status, props)', function () {
    const err = createError(404, {
      id: 1
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(status, props) with status prop', function () {
    const err = createError(404, {
      id: 1,
      status: 500
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(status, props) with statusCode prop', function () {
    const err = createError(404, {
      id: 1,
      statusCode: 500
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(props)', function () {
    const err = createError({
      id: 1
    })
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.id, 1)
  })

  it('createError(msg, status)', function () {
    assert.throws(function () {
      createError('LOL', 404)
    }, /argument #2 unsupported type number/)
  })

  it('createError(msg)', function () {
    const err = createError('LOL')
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
  })

  it('createError(msg, props)', function () {
    const err = createError('LOL', {
      id: 1
    })
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.id, 1)
  })

  it('createError(err)', function () {
    let _err = new Error('LOL')
    _err.status = 404
    let err = createError(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)

    _err = new Error('LOL')
    err = createError(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)

    err = createError(null)
    assert.notStrictEqual(err, null)
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
  })

  it('createError(err) with invalid err.status', function () {
    const _err = new Error('Connection refused')
    _err.status = -1
    const err = createError(_err)
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'Connection refused')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
  })

  it('createError(err, props)', function () {
    const _err = new Error('LOL')
    _err.status = 404
    const err = createError(_err, {
      id: 1
    })
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
    assert.strictEqual(err.expose, true)
  })

  it('createError(status, err, props)', function () {
    const _err = new Error('LOL')
    const err = createError(404, _err, {
      id: 1
    })
    assert.strictEqual(err, _err)
    assert.strictEqual(err.name, 'Error')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(status, msg, props)', function () {
    const err = createError(404, 'LOL', {
      id: 1
    })
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'LOL')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.id, 1)
  })

  it('createError(status, msg, { expose: false })', function () {
    const err = createError(404, 'LOL', {
      expose: false
    })
    assert.strictEqual(err.expose, false)
  })

  it('new createError.HttpError()', function () {
    assert.throws(function () {
      new createError.HttpError() // eslint-disable-line no-new
    }, /cannot construct abstract class/)
  })

  it('new createError.NotFound()', function () {
    const err = new createError.NotFound()
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)
    assert(err.stack)
  })

  it('new createError.InternalServerError()', function () {
    const err = new createError.InternalServerError()
    assert.strictEqual(err.name, 'InternalServerError')
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
    assert.strictEqual(err.statusCode, 500)
    assert.strictEqual(err.expose, false)
    assert(err.stack)
  })

  it('new createError["404"]()', function () {
    const err = new createError['404']()
    assert.strictEqual(err.name, 'NotFoundError')
    assert.strictEqual(err.message, 'Not Found')
    assert.strictEqual(err.status, 404)
    assert.strictEqual(err.statusCode, 404)
    assert.strictEqual(err.expose, true)
    assert(err.stack)
  })

  it('should preserve error [[Class]]', function () {
    assert.strictEqual(Object.prototype.toString.call(createError('LOL')), '[object Error]')
    assert.strictEqual(Object.prototype.toString.call(new createError[404]()), '[object Error]')
    assert.strictEqual(Object.prototype.toString.call(new createError[500]()), '[object Error]')
  })

  it('should support err instanceof Error', function () {
    assert(createError(404) instanceof Error)
    assert((new createError['404']()) instanceof Error)
    assert((new createError['500']()) instanceof Error)
  })

  it('should support err instanceof exposed constructor', function () {
    assert(createError(404) instanceof createError.NotFound)
    assert(createError(500) instanceof createError.InternalServerError)
    assert((new createError['404']()) instanceof createError.NotFound)
    assert((new createError['500']()) instanceof createError.InternalServerError)
    assert((new createError.NotFound()) instanceof createError.NotFound)
    assert((new createError.InternalServerError()) instanceof createError.InternalServerError)
  })

  it('should support err instanceof HttpError', function () {
    assert(createError(404) instanceof createError.HttpError)
    assert((new createError['404']()) instanceof createError.HttpError)
    assert((new createError['500']()) instanceof createError.HttpError)
  })

  it('should support types.isNativeError()', function () {
    assert(types.isNativeError(createError(404)))
    assert(types.isNativeError(new createError['404']()))
    assert(types.isNativeError(new createError['500']()))
  })
})
