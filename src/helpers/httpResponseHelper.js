// Http response  helper

const httpResponse = (res) => {
  this.res = res;
  const _status = (status, r) => {
    res.status(status).json(r || {});
  };
  return {
    error: (e) => {
      if (e && e.status) {
        _status(e.status, e);
      } else {
        _status(500, e);
      }
    },
    created: (r) => {
      if (!r) {
        const e = {status: 404, menssage: 'Not found.'};
        _status(e.status, e);
      } else if (r.status) {
        _status(r.status, r);
      } else {
        _status(201, r);
      }
    },
    ok: (r) => {
      if (!r) {
        const e = {status: 404, menssage: 'Not found.'};
        _status(e.status, e);
      } else if (r.status) {
        _status(r.status, r);
      } else {
        _status(200, r);
      }
    },
    notFound: (res, r) => {
      _status(404, r);
    },
  };
};
module.exports = httpResponse;
