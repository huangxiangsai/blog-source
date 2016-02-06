---
title: jQuery.ajax在IE中跨域请求
date: 2015-06-19 16:36:59
tags: [前端,JavaScript]

---

在小的项目中，估计永远都不会碰到跨域请求的问题。始终都是在一个域下面，可能连静态和动态都是在一起。

但是一个大项目，会将里面的业务拆分成多个子项目，根据业务的不同，子项目都会有它自己的子域。 所以在主项目中，访问不同业务下的接口，将会发生跨域的问题。

一般我们对于跨域会采用下以两种方式解决：

>  1. 通过在返回的头部 `Access-Control-Allow-Origin` 添加指定的域，来允许跨域。

>  2.  使用jsonp方式，实现跨域请求。


然而，很多时候，接口已经存在，并且已经在别处使用（不存在跨域问题），这时，一个在不同域的地方需要调用这个接口，我们第一想到的就是使用上述的第一种方式来解决跨域问题。

因为这样改动是最小的（程序猿都很懒的）

我也是一样，后端的童鞋改完后，我在chrome上调试下可以了。（我真的很厉害，虽然代码都不是我改的，只是刷了下页面）。

完了，在我们可爱的IE上也要试试的（我是IE9），不试不知道，一试吓一跳，通过fiddler居然没有找到请求。（IE真调皮）

没办法只有打开IE简陋的调试工具，在对应的`done`和`fail`中打印些信息出来。再次刷新页面后，果然进入的fail，并打印出了 `no transport` 。

这是什么错，没见过啊。于是就开始各种搜索， 搜索的结果，大致有两类，

一种是说，这跟IE的安全设置有关，要进入xxx >> xxx 然后再设置下就好了。

还有一种是说，直接换成`jsonp`吧。

第一种完全不靠谱，不可能让每个用户都这么干啊，pass ,第二种嘛，不多说了，还是再找找其他的方法吧。实在没办法才去想这么做。

最终，还在通过万能的google，找到了解决方法。 需要通过`jQuery.ajaxTransport`方法来设置一个对象，当然只需要在IE10以下的版本中使用就可以了。具体的代码如下：


    if (!jQuery.support.cors && window.XDomainRequest) {
                var httpRegEx = /^https?:\/\//i;
                var getOrPostRegEx = /^get|post$/i;
                var sameSchemeRegEx = new RegExp('^'+location.protocol, 'i');
                var xmlRegEx = /\/xml/i;
                
                // ajaxTransport exists in jQuery 1.5+
                jQuery.ajaxTransport('text html xml json', function(options, userOptions, jqXHR){
                    // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
                    if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url) && sameSchemeRegEx.test(userOptions.url)) {
                        var xdr = null;
                        var userType = (userOptions.dataType||'').toLowerCase();
                        return {
                            send: function(headers, complete){
                                xdr = new XDomainRequest();
                                if (/^\d+$/.test(userOptions.timeout)) {
                                    xdr.timeout = userOptions.timeout;
                                }
                                xdr.ontimeout = function(){
                                    complete(500, 'timeout');
                                };
                                xdr.onload = function(){
                                    var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                                    var status = {
                                        code: 200,
                                        message: 'success'
                                    };
                                    var responses = {
                                        text: xdr.responseText
                                    };
                           
                                    try {
                                        if (userType === 'json') {
                                            try {
                                                responses.json = JSON.parse(xdr.responseText);
                                            } catch(e) {
                                                status.code = 500;
                                                status.message = 'parseerror';
                                                //throw 'Invalid JSON: ' + xdr.responseText;
                                            }
                                        } else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                            var doc = new ActiveXObject('Microsoft.XMLDOM');
                                            doc.async = false;
                                            try {
                                                doc.loadXML(xdr.responseText);
                                            } catch(e) {
                                                doc = undefined;
                                            }
                                            if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                                status.code = 500;
                                                status.message = 'parseerror';
                                                throw 'Invalid XML: ' + xdr.responseText;
                                            }
                                            responses.xml = doc;
                                        }
                                    } catch(parseMessage) {
                                        throw parseMessage;
                                    } finally {
                                        complete(status.code, status.message, responses, allResponseHeaders);
                                    }
                                };
                                xdr.onerror = function(){
                                    complete(500, 'error', {
                                        text: xdr.responseText
                                    });
                                };
                                xdr.open(options.type, options.url);
                                //xdr.send(userOptions.data);
                                xdr.send();
                            },
                            abort: function(){
                                if (xdr) {
                                    xdr.abort();
                                }
                            }
                        };
                    }
                });
            };
            jQuery.support.cors = true;
            $.ajax({
                crossDomain: true,
                url : 'http://127.0.0.1:8080/fm/json',
                type : 'GET',
                dataType : 'json',
            }).done(successHandler)
            .fail(function() {
                console.log('error');
            });

上面的代码看不是很清楚的话，有某个大神在JSFiddle中的demo,见花献佛了。*[想看DEMO请猛击这里](http://jsfiddle.net/bjW8t/4/)*。

再次刷IE，成功执行。 

随便再说下，在搜索这问题的时候，也有很多告诉说添加这一句`jQuery.support.cors = true;`就好了， 可添加了这句后，`no transport`的错是没了，但会报其他的错。然后就没然后了。

所以希望碰到这类问题的童鞋能看到这篇，也希望能对你有实质性的帮助。
