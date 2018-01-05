
var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

var snowSwirl = {
  // change these
  max_flake_size: 28,
  min_flake_size: 12,
  fps: 50,
  sink_speed: 4,
  snow_count: 40,
  snow_colors: ["#aaaacc","#ddddFF","#ccccDD"],

  // don't change these
  breeze: 2000,
  pile: false,
  snow: [],
  snow_accel: [2,3,4,5,6,5,4,3,2,1,1,1,1],
  running: true,
  swirl: true,

  setSnow: function() {
    this.document_width = $(document).width();
    this.document_height = $(document).height() - 20;
    this.timeout_ms = (1000 / this.fps);

    for (i=0; i <= this.snow_count; i++) {
      $('body').append("<span id='s" + i + "' style='position:absolute; top:-" + this.max_flake_size + ";'>" + "*" + "</span>");
      var snow_flake = this.snow[i] = document.getElementById('s' + i);

      // set random size within range for flake
      snow_flake.size = this.randomFloat(this.min_flake_size, this.max_flake_size);
      snow_flake.style.fontSize = snow_flake.size + "px";
      snow_flake.style.color = this.snow_colors[this.randomInt(0, this.snow_colors.length - 1)];

      // vary the speed of falling snow
      snow_flake.random_sink = (this.randomFloat(1, 6) + this.sink_speed) / 10;
      snow_flake.float_counter = this.randomFloat(0, 6);

      snow_flake.posy = Math.random() * this.document_height;
      snow_flake.posx = Math.random() * this.document_width;

      snow_flake.style.top = snow_flake.posy + "px";
      snow_flake.style.left = snow_flake.posx + "px";
    }
  },

  moveSnow: function() {
    for (i=0; i <= snowSwirl.snow_count; i++) {
      var snow_flake = snowSwirl.snow[i];
      var snow_height = parseFloat(snow_flake.style.top);

      // put snow back up top if it has reached the bottom of page
      if (snow_height > snowSwirl.document_height) {
        if (snowSwirl.pile == false) {
          snow_flake.style.top = "0px";
        }
      } else {
        snow_flake.style.top = snow_height + snow_flake.random_sink + "px";

        if (snowSwirl.breeze < 2000) {
          var tween_idx = Math.floor(snowSwirl.breeze/200);
          snow_flake.posx -= snowSwirl.snow_accel[tween_idx];
          snow_flake.style.left = snow_flake.posx + "px";
          snowSwirl.breeze += 1;
        } else if (snowSwirl.swirl) {
          snow_flake.posx += Math.sin(snow_flake.float_counter);
          snow_flake.style.left = snow_flake.posx + "px";

          snow_flake.float_counter > 8000 ? snow_flake.float_counter = 0 : snow_flake.float_counter += .04;
        }
      }

      // keep snow from disappearing off to left
      if (snow_flake.posx < 0) {
        snow_flake.style.left = snow_flake.posx = snowSwirl.document_width;
      }
    }

    if (snowSwirl.running) {
      setTimeout(function() {
        requestAnimationFrame(snowSwirl.moveSnow);
      }, snowSwirl.timeout_ms);
    }
  },

  randomFloat: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  randomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  sendBreeze: function() {
    if (snowSwirl.breeze > 1999) {
      snowSwirl.breeze = 0;
    }
  },

  startSnowing: function() {
    this.setSnow();
    this.moveSnow();
  },

  togglePile: function() {
    snowSwirl.pile = (snowSwirl.pile ? false : true);
  },

  toggleSnow: function() {
    if (snowSwirl.running) {
      snowSwirl.running = false;
    } else {
      snowSwirl.running = true;
      snowSwirl.moveSnow();
    }
  },

  toggleSwirl: function() {
    snowSwirl.swirl = (snowSwirl.swirl ? false : true);
  },

  windowResize: function() {
    if (snowSwirl.running) {
      snowSwirl.setSnow();
    }
  }
};
