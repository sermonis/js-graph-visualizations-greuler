'use strict';

(function () {
  var greuler = window.greuler;

  var instance = greuler({
    target: '#dfs',
    height: 500,
    animationTime: 500,
    data: greuler.Graph.random({ connected: true })
  }).update();

  window.examples.dfs = function () {
    var player = new greuler.player.Generator(instance);
    player.run(function *algorithm(instance) {
      var visited = [];

      function *dfs(u, p) {
        yield function () {
          instance.selector.highlightNode({ id: u });
        };
        visited[u] = true;

        var adjacent = instance.graph.getAdjacentNodes(u);
        for (var i = 0; i < adjacent.length; i += 1) {
          var v = adjacent[i].id;

          if (v === p) { continue; }

          if (!visited[v]) {
            yield function () {
              instance.selector.traverseEdgesBetween({
                source: u,
                target: v
              });
            };
            yield *dfs(v, u);
          } else {
            yield function () {
              instance.selector.traverseEdgesBetween({
                source: u,
                target: v
              }, {keepStroke: false}).transition().attr('opacity', 0.4);
            };
          }
        }

        yield function () {
          instance.selector.getNode({ id: u })
            .transition()
            .attr('fill', 'black');
        };
      }

      yield *dfs(0, -1);
    });
  };
})();
