import d3 from 'd3';
import barSeries from '../../series/bar';
import multiSeries from '../../series/multi';
import {noop} from '../../util/fn';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xValue = function(d) { return d.date; },
        root = function(d) { return d.elderRay; },
        bullBar = barSeries(),
        bearBar = barSeries(),
        bullBarTop = barSeries(),
        bearBarTop = barSeries(),
        multi = multiSeries(),
        decorate = noop;

    var elderRay = function(selection) {

        function isTop(input, comparison) {
            // The values share parity and the input is smaller than the comparison
            return (input * comparison > 0 && Math.abs(input) < Math.abs(comparison));
        }

        bullBar
            .xValue(xValue)
            .yValue(function(d, i) {
                return isTop(root(d).bullPower, root(d).bearPower) ? undefined : root(d).bullPower;
            });

        bearBar
            .xValue(xValue)
            .yValue(function(d, i) {
                return isTop(root(d).bearPower, root(d).bullPower) ? undefined : root(d).bearPower;
            });

        bullBarTop
            .xValue(xValue)
            .yValue(function(d, i) {
                return isTop(root(d).bullPower, root(d).bearPower) ? root(d).bullPower : undefined;
            });

        bearBarTop
            .xValue(xValue)
            .yValue(function(d, i) {
                return isTop(root(d).bearPower, root(d).bullPower) ? root(d).bearPower : undefined;
            });

        multi
            .xScale(xScale)
            .yScale(yScale)
            .series([bullBar, bearBar, bullBarTop, bearBarTop])
            .decorate(function(g, data, index) {
                g.enter()
                    .attr('class', function(d, i) {
                        return 'multi ' + ['bull', 'bear', 'bull top', 'bear top'][i];
                    });
                decorate(g, data, index);
            });

        selection.call(multi);
    };

    elderRay.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return elderRay;
    };
    elderRay.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = x;
        return elderRay;
    };
    elderRay.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return elderRay;
    };
    elderRay.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return elderRay;
    };

    return elderRay;
}
