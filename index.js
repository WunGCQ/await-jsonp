import qs from 'qs';

export function jsonp(url, params, errorFunc = alert) {
  // thefair
  //  response :{code:0,message: { text: '', action:''},result}
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const name = `temp${Math.floor(Math.random() * 10000)}${Date.now()}`;
    const temp = function (data) {
      if (typeof data == 'string' || typeof data == 'number') {
        resolve({
          ok: false,
          result: data
        });
      } else {
        if (data.code != 0) {
          errorFunc(data.message.text,1000);
        }
        resolve({
          ok: data.code == 0,
          message: data.message,
          result: data.result,
        });
      }
      document.body.removeChild(script);
      setTimeout(function(){
        delete window[name];        
      },1000);
    };
    window[name] = temp;
    const str = qs.stringify(params, {
      arrayFormat: 'brackets'
    });
    script.src = `${url}?__callback=${name}&${str}`;
    document.body.appendChild(script);
  });
}
