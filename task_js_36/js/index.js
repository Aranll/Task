(function () {
  var WIDTH = 42;
  var HEIGHT = 42;
  var btn = document.getElementById('btn');
  var userIn = document.getElementById('userIn');
  var clearBtn = document.getElementById('reFresh');
  var build = document.getElementById('build');
  var randomBtn = document.getElementById('random');

  var controller = (function () {
    function mkMaze (container, config) {
      var x = config.x;
      var y = config.y;
      var i, j;
      var el = document.createDocumentFragment();
      var arr = [];
      for (i = 0;i < x;i++) {
        for (j = 0;j < y;j++) {
          el.appendChild(_createDiv({
            x: x,
            y: y,
            i: i,
            j: j
          }));
        }
      }
      container.style.width = config.y * WIDTH + config.y - 1 + 'px';
      container.appendChild(el);
      return _mkAction(container, config);
    }
    function _createDiv (obj) {
      var oDiv = document.createElement('div');
      oDiv.className = 'maze-block';
      if (obj.j === 0 && obj.i !== 0) {
        oDiv.style.clear = 'both';
      } 
      if (obj.i === obj.x - 1) {
        oDiv.className += ' bottom-maze-block';
      }
      if (obj.j === obj.y - 1) {
        oDiv.className += ' right-maze-block';
      }
      return oDiv;
    }
    function _mkAction (container, obj) {
      var ox = Math.floor(Math.random() * obj.x + 0);
      var oy = Math.floor(Math.random() * obj.y + 0);
      var action = _createAction(ox, oy);
      container.appendChild(action);
      return {
        x: ox,
        y: oy,
        action: action,
        turn: 0,
        rotate: 0
      }
    }
    function _createAction (ox, oy) {
      var oAction = document.createElement('div');
      oAction.className = 'Action';
      oAction.style.position = 'absolute';
      oAction.style.left = oy * (WIDTH + 1) + 'px';
      oAction.style.top = ox * (HEIGHT + 1) + 'px';
      return oAction;
    }

    return (function () {
      var pos = mkMaze(document.getElementById('container'), {
        x: 10,
        y: 10,
      });
      function move (force, num) {
        var turn = force || pos.turn;
        var tempX = pos.x,
            tempY = pos.y;
        if (num === 0) {
          return;
        }
        if (turn === 0) {
          pos.x > 0 && pos.x--;
        } else if (turn === 1) {
           pos.y < 9 && pos.y++;
        } else if (turn === 2) {
           pos.x < 9 && pos.x++;
        } else if (turn === 3) {
           pos.y > 0 && pos.y--;
        }
        if (build.search(pos.x, pos.y)) {
          pos.action.style.left = pos.y * (WIDTH + 1) + 'px';
          pos.action.style.top = pos.x * (HEIGHT + 1) + 'px';
          num && move(force, num - 1);
        } else {
          pos.x = tempX;
          pos.y = tempY;
          console.log('前方有障碍');
        }
      }
      function turn (type, rotate) {
        if (rotate === undefined) {
          if (type === 1) {
            pos.rotate -= 90;
          } else if (type === 2) {
            pos.rotate += 90;
          } else if (type === 3) {
            pos.rotate += 180;
          }
          if (pos.rotate >= 360) {
            pos.rotate -= 360;
          }
          if (pos.rotate <= - 360) {
            pos.rotate += 360;
          }   
        } else {
          pos.rotate = rotate;
        }
       if (pos.rotate >= 0) {
          pos.turn = pos.rotate / 90;
        } else {
          pos.turn = 4 + pos.rotate / 90;
        }
        pos.action.style.transform = 'rotate(' + pos.rotate +  'deg)';
      }
      return {
        move: move,
        turn: turn,
        getPos: function () {
          return pos;
        },
        moveTo: function (arr) {
          var i = 1;
          pos.x = arr[i].x;
          pos.y = arr[i].y;
          pos.action.style.left = arr[i].y * (WIDTH + 1) + 'px';
          pos.action.style.top = arr[i].x * (HEIGHT + 1) + 'px';
          var timer = setInterval(function () {
            if (++i < arr.length) {
              pos.x = arr[i].x;
              pos.y = arr[i].y;
              pos.action.style.left = arr[i].y * (WIDTH + 1) + 'px';
              pos.action.style.top = arr[i].x * (HEIGHT + 1) + 'px';
            } else {
              clearInterval(timer);
            }
          }, 1000);
        }
      };
    }());
  }());

  var handler = {
    'GO': function (num) {
      controller.move(null, num);
    },
    'TUN LEF': function () {
      controller.turn(1);
    },
    'TUN RIG': function () {
      controller.turn(2);
    },
    'TRA LEF': function (num) {
      controller.move(3, num);
    },
    'TRA TOP': function (num) {
      controller.move(0, num);
    },
    'TRA RIG': function (num) {
      controller.move(1, num);
    },
    'TRA BOT': function (num) {
      controller.move(2, num);
    },
    'TUN BAC': function () {
      controller.turn(3);
    },
    'MOV LEF': function (num) {
      controller.turn(null, 270);
      controller.move(null, num);
    },
    'MOV TOP': function (num) {
      controller.turn(null, 0);
      controller.move(null, num);
    },
    'MOV RIG': function (num) {
      controller.turn(null, 90);
      controller.move(null, num);
    },
    'MOV BOT': function (num) {
      controller.turn(null, 180);
      controller.move(null, num);
    },
    'BIUD': function () {
      build.build();
    },
    'BRU': function (color) {
      build.renderBuild(color);
    },
    'MOV TO': function (x, y) {
      var arr = build.searchTheWay(x * 1, y * 1);
      controller.moveTo(arr);
    }
  }
  var handlTextArea = (function () {
    var matchEnterExp = /\r|\n/g;
    var matchConsoleExp = /\n/g;
    var row = 0;
    var textArea = document.getElementById('userIn');
    var rowList = document.getElementById('show-row');

    function _addRow (enterNum) {
      if (row !== enterNum) {
        var el;
        var temp = document.createDocumentFragment();
        rowList.innerHTML = '';
        for (var i = 0;i <= enterNum;i++) {
          el = document.createElement('div');
          el.className = 'row-el';
          el.innerHTML = i;
          temp.appendChild(el);
        }
        rowList.appendChild(temp);
        row = enterNum;
      }
    }
    return {
      matchEnter: function () {
        var value = textArea.value;
        var enterNum = value.match(matchEnterExp) && value.match(matchEnterExp).length;
        _addRow(enterNum);
      },
      matchConsole: function () {
        var value = textArea.value;
        var consoleArr = value.split(matchConsoleExp);
        return consoleArr;
      },
      scrollList: function (scrollTop) {
        rowList.scrollTop = scrollTop;
      }
    }
  }());
  var execConsole = (function () {
    var spExp = /MOV|TRA|GO/;
    var coExp = /BRU/;
    var movExp = /MOV TO/;
    var rowList = document.getElementById('show-row');
    var consoleExp = '';
    var timer;
    for (var key in handler) {
      if (coExp.test(key)) {
        consoleExp += '^' + key + '(\\s+.+)$|'
      } else if (movExp.test(key)) {
        consoleExp += '^' + key + '\\s+[0-9]+\\s*,\\s*[0-9]+\\s*$|';
      } else if (spExp.test(key)) {
        consoleExp += '^' + key + '(\\s+[0-9]+)?$|';
      } else {
        consoleExp += '^' + key + '$|';
      }
    }
    consoleExp = consoleExp.slice(0,-1);
    consoleExp = new RegExp(consoleExp);
    console.log(consoleExp);
    function _jud (arr) {
      return arr && arr.map(function (item, index) {
        item = item.replace(/^\s+|\s+$/g, '');
        if (consoleExp.test(item)) {
          return item;
        } else {
          return false;
        }
      });
    }
    return {
      exec: function () {
        var consoleArr = _jud(handlTextArea.matchConsole());
        var i = 0;
        var fn = handler[consoleArr[i].replace(/\s+[0-9]+\s*$/, '')];
        var num = consoleArr[i].match(/[0-9]+/) && consoleArr[i].match(/[0-9]+/)[0];
        var color = consoleArr[i].match(/BRU\s+(.+)/) && consoleArr[i].match(/BRU\s+(.+)/)[1];
        if (/BRU/.test(consoleArr[i])) {
          handler['BRU'](color);
        } else if (/MOV TO/.test(consoleArr[i])) {
          var obj = consoleArr[i].match(/([0-9]+)/g);
          var len = build.searchTheWay(obj[0] * 1, obj[1] * 1).length;
          handler['MOV TO'](obj[0], obj[1]);
          clearTimeout(timer);
          console.log(len);
          timer = setInterval(exec, len * 1000);
        } else if (num) {
          fn(num);
        } else {
          fn();
        }
        i++;
        if (!len) {
          timer = setInterval(exec, 1000);
        }
        function exec () {
          if (i >= consoleArr.length) {
            clearInterval(timer);
            return;
          }
          fn = handler[consoleArr[i].replace(/\s+[0-9]+\s*$/, '')];
          num = consoleArr[i].match(/[0-9]+/) && consoleArr[i].match(/[0-9]+/)[0];
          color = consoleArr[i].match(/BRU\s+(.+)/) && consoleArr[i].match(/BRU\s+(.+)/)[1];
          clearTimeout(timer);
          timer = setInterval(exec, 1000);
          if (/BRU/.test(consoleArr[i])) {
            handler['BRU'](color);
          } else if (/MOV TO/.test(consoleArr[i])) {
            var obj = consoleArr[i].match(/([0-9]+)/g);
            var len = build.searchTheWay(obj[0] * 1, obj[1] * 1);
            handler['MOV TO'](obj[0], obj[1]);
            clearTimeout(timer);
            timer = setInterval(exec, len * 1000);
          } else if (num) {
            fn(num);
          } else {
            fn();
          }
          i++;
        }
      },
      check: function () {
        var checkArr = _jud(handlTextArea.matchConsole());
        var flag = true;
        checkArr && checkArr.forEach(function (item, index) {
          if (!item) {
            rowList.children[index] && (rowList.children[index].style.background = 'red');
            flag = false;
          } else {
            rowList.children[index] && (rowList.children[index].style.background = '');
          }
        })
        return flag;
      }
    }
  }());
  var build = (function () {
    var buildArr = [];
    var container = document.getElementById('container');
    function randomBuild (obj) {
      var ox = Math.floor(Math.random() * obj.x + 0);
      var oy = Math.floor(Math.random() * obj.y + 0);
      if (ox === obj.no.x && oy === obj.no.y) {
        return randomBuild(obj);
      }
      if (buildArr.length == container.children.length - 1) {
        console.log('没有格子了');
      }
      for (var i = 0,j = buildArr.length;i < j;i++) {
        if (buildArr[i].x === ox && buildArr[i].y === oy) {
          return randomBuild(obj);
        }
      }
      _jud(ox, oy);
    }
    function _mkBuild (ox, oy) {
      var oBuild = document.createElement('div');
      oBuild.className = 'build';
      oBuild.style.position = 'absolute';
      oBuild.style.left = oy * (WIDTH + 1) + 'px';
      oBuild.style.top = ox * (HEIGHT + 1) + 'px';
      buildArr.push({
        x: ox,
        y: oy,
        el: oBuild
      });
      container.appendChild(oBuild);
    }
    function _jud (ox, oy) {
      var flag = true;
      buildArr.forEach(function (item) {
        if (item.x === ox && item.y === oy) {
          flag = false;
        }
      });
      if (ox < 0 || ox > 9 || oy < 0 || oy > 9) {
        flag = false;
      }
      if (flag) {
        _mkBuild(ox, oy);
      } else {
        console.log('错误此位置已有墙壁');
      }
    }
    function _centerPos () {
      var turn = controller.getPos().turn;
      var ox = controller.getPos().x,
          oy = controller.getPos().y;
      if (turn === 0) {
        ox--;
      } else if (turn === 1) {
        oy++;
      } else if (turn === 2) {
        ox++;
      } else if (turn === 3) {
        oy--;
      }
      return {
        ox: ox,
        oy: oy
      }
    }
    function build () {
      var pos = _centerPos();
      _jud(pos.ox, pos.oy);
    }
    function renderBuild (color) {
      var pos = _centerPos();
      var flag = false;
      buildArr.forEach(function (item) {
        if (item.x === pos.ox && item.y === pos.oy) {
          item.el.style.background = color;
          flag = true;
        }
      });
      !flag && console.log('错误 此处没有墙壁');
    }
    function search (x, y) {
      var flag = true;
      buildArr.forEach(function (item) {
        if (item.x === x && item.y === y) {
          flag = false;
        }
      })
      if (x < 0 || x > 9 || y < 0 || y > 9) {
        flag = false;
      }
      return flag;
    }

    //迷宫道路试探
    function searchTheWay (endX, endY) {
        var pos = controller.getPos();
        var haveToArr = [],
            posArr = [];
        var count = [];
        function goSearch (x, y) {
          var min;
          haveToArr.push({
            x: x,
            y: y
          });
          if (x === endX && y === endY) {
            return;
          }
          if (_search(x - 1, y)) {
            count.push({
              x: x - 1,
              y: y
            });
          } 
          if (_search(x, y + 1)) {
             count.push({
              x: x,
              y: y + 1
            });
          }
          if (_search(x + 1, y)) {
             count.push({
              x: x + 1,
              y: y
            });
          } 
          if (_search(x, y - 1)) {
             count.push({
              x: x,
              y: y - 1
            });
          }
          count.forEach(function (item) {
            if (!min) {
              min = item;
            }
            if (returnDis({
              x: item.x,
              y: item.y
            }, endX, endY) < returnDis(min, endX, endY)) {
              min = item;
            }
          });
          count = [];
          goSearch(min.x, min.y);
        }
      function returnDis (obj, x, y) {
        return Math.abs(obj.x - x) + Math.abs(obj.y - y);
      }
      function _search (x, y) {
        var flag = search(x, y);
        if (flag) {   
          haveToArr.forEach(function (item) {
            if (item.x === x && item.y === y) {
              flag = false;
            }
          });
        }
        return flag;
      }
      goSearch(pos.x, pos.y);
      return haveToArr;
    }
    return {
      randomBuild: randomBuild,
      build: build,
      renderBuild: renderBuild,
      search: search,
      searchTheWay: searchTheWay
    }
  }());
  build.randomBuild({
    x: 10,
    y: 10,
    no: controller.getPos()
  })
  var textTimer = setInterval(function () {
    handlTextArea.matchEnter();
  },500);
  btn.addEventListener('click', function () {
    var flag = execConsole.check();
    flag && execConsole.exec();
  });
  userIn.addEventListener('scroll', function () {
    handlTextArea.scrollList(this.scrollTop);
  });
  randomBtn.addEventListener('click', function () {
    build.randomBuild({
      x: 10,
      y: 10,
      no: controller.getPos()
    });
  })
  clearBtn.addEventListener('click', function () {
    userIn.value = '';
  });
}());