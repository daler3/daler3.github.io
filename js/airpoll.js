    var color1;
    var cValue1;
    
    function read_csv(d_path1, d_path2, d_path3, xAmount, coeff, intercept, caption, id, dataset, newline){
        d3.csv(d_path1, function (error, data){
            if(error){
                 
            } else{
                data.map(function(d){ 
                    no2.push(parseFloat(d.NO2));
                    o3.push(parseFloat(d.O3)); 
                    pm25.push(parseFloat(d.PM25)); 
                    bc.push(parseFloat(d.BC));
                    borough.push((d.Borough));
                    cb.push((d.CB));
                    neigh.push((d.Neighbourhood));                      
                });
            };
            second_csv(d_path2, d_path3, xAmount, coeff, intercept, caption, id)
        });                                
    } 

    function second_csv(d_path2, d_path3, xAmount, coeff, intercept, caption, id){
        d3.csv(d_path2, function (error, data){
            if(error){
                console.log(error)
            } else{
                data.map(function(d){ 
                    if(id == "treesAmount"){
                        xAmount.push(parseInt(d.TreesAmount)); 
                    }    
                });
            };
            third_csv(d_path3, xAmount, coeff, intercept, caption, id)
        });                                
    } 

    function third_csv(d_path3, xAmount, coeff, intercept, caption, id){
        d3.csv(d_path3, function (error, data){
            if(error){
                console.log(error)
            } else{
                data.map(function(d){ 
                    coeff.push(parseFloat(d.Coeff));
                    intercept.push(parseFloat(d.Intercept));            
                });
            };
            do_svg_stuff(xAmount, coeff, intercept, caption, id);
        });                                
    } 


    function do_svg_stuff(xAmount, coeff, intercept, caption, id){
        dataset = fill_data(xAmount, no2, coeff[0], intercept[0], caption);
        // cValue = function(d) { return d.b; },
        //         color = d3.scale.category10();
        // function for creation of line
        newline = d3.line()
            .x(function(d) {
                return xScale(d.x);
            })
            .y(function(d) {
                return yScale(d.yhat);
            });


        ////// Define Scales /////////////////
        xScale = d3.scaleLinear()
                              .domain([
                                d3.min(dataset, function(d){
                                  return d.x;
                                }),
                                d3.max(dataset, function(d){
                                  return d.x;
                              })])
                              .range([padding+10,w - 10 - padding*2]);

        yScale = d3.scaleLinear()
                              .domain([
                                d3.min(dataset, function(d){
                                  return(d.y);
                                }),
                                d3.max(dataset, function(d){
                                  return (d.y);
                              })]) //y range is reversed because svg
                              .range([h-padding-10, padding+11]);
        /////// Define Axis //////////////////////////////
        xAxis = d3.axisBottom()
                          .scale(xScale);

        yAxis1 = d3.axisLeft()
                      .scale(yScale)
                      .ticks(5);
        // create svg
        svg_airpoll1 = d3.select("#airpoll")
                    .append("svg")
                    .attr("width",w)
                    .attr("height", h);

        // cut off datapoints that are outside the axis
        svg_airpoll1.append("clipPath")
            .attr("id", "chart-area")
            .append("rect")
            .attr("x", padding)
            .attr("y", padding)
            .attr("width", w-padding * 3)
            .attr("height", h-padding *2);

        // append data points
        svg_airpoll1.append("g")
            .attr("clip-path", "url(#chart-area)")
            .selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", function(d){
              return xScale(d.x);
            })
            .attr("cy", function(d){
              return yScale(d.y);
            })
            .attr("r", 4.5)
            .attr("opacity", "0.9")
            .attr("id", function(d){
                return "cb1"+d.CB;
            })
            .style("fill", function(d) {cValue1 = function (d) { return d; },
        color1 = d3.scale.category10();  return color1(cValue1(d.b)); })
            .on("mouseover", function(d, i) {
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltip.html(d.CB + "<br/> (" + (d.neigh) 
                                + ")")
                        .style("left", 500 + "px")
                        .style("top", 100 + "px");

                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", "4.0")
                    .style("opacity", "0.7")

                d3  .select("#cb" + d.CB)
                    .style("opacity", "0.4");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
                d3  .select("#cb" + d.CB)
                    .style("opacity", "0.9");
                d3.select(this)
                    .style("stroke-width", "0.5")
                    .style("opacity", "0.9")
            });


        // append regression line
        svg_airpoll1.append("path")
            .datum(dataset)
            .attr("clip-path", "url(#chart-area)")
            .attr("class", "line")
            .attr("d", newline);

        // append Axes ///////////////////////////
        svg_airpoll1.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (h-padding) + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", w)
            .attr("y", -6);

        svg_airpoll1.append("g")
            .attr("class", "y axis1")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis1)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");

        svg_airpoll1.append("text")
            .attr("class", "xaxis_label")
            .attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (w/2+270) +","+((h-((padding-2)/10))-45)+")")  // centre below axis
            .text(function(){
                if (id == "treesAmount"){
                    return ("Trees Amount")
                }
            });

        svg_airpoll1.append("text")
            .attr("class", "yaxis_label")
            .attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ ((padding/5)+40) +","+((h-(padding+160))/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(caption);



          // draw legend
        legend = svg_airpoll1.selectAll(".legend")
                    .data(color1.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(-140," + i * 20 + ")"; });

          // draw legend colored rectangles
        legend.append("rect")
              .attr("x", w - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color1);

          // draw legend text
        legend.append("text")
              .attr("x", w - 20)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d;})

        tooltip = d3.select("#airpoll").append("div")
                    .attr("class", "tooltip")
                    .style("z-index", 10000)
                    .style("opacity", 0);

    }

    function update_fig(airpoll, n, caption){
        dataset = fill_data(treesAmount, airpoll, coeff[n], intercept[n], caption);

        //Update scale domains
        xScale.domain([
            d3.min(dataset, function(d) { return d.x; }), 
            d3.max(dataset, function(d) { return d.x; })
        ]);
        yScale.domain([
           d3.min(dataset, function(d) { return d.y; }),
           d3.max(dataset, function(d) { return d.y; })
        ]);

        // update data points
        svg_airpoll1.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1000)
            .attr("cx", function(d){
              return xScale(d.x);
            })
            .attr("cy", function(d){
              return yScale(d.y);
            });

        // update and transition regression line
        svg_airpoll1.select("path")
            .datum(dataset)
            .transition()
            .duration(1000)
            .attr("d", newline);;

        // update axis
        svg_airpoll1.select(".x.axis")
              .transition()
              .duration(1000)
              .call(xAxis);

        svg_airpoll1.select(".y.axis1")
                .transition()
                .duration(1000)
                .call(yAxis1);

        svg_airpoll1.select(".yaxis_label")
                    .transition()
                    .duration(4000)
                    .text(caption);
    }

    function fill_data(x, y, coeff, intercept, caption) {
        caption = caption; 
        var yhat = [];
        for (i = 0; i < x.length; i++) {
            yhat.push(intercept + (x[i] * coeff));
        }

        var data = [];
        for (i = 0; i < y.length; i++) {
            data.push({
                "yhat": yhat[i],
                "y": y[i],
                "x": x[i],
                "b": borough[i],
                "CB": cb[i],
                "neigh": neigh[i]
            })
        }
        return (data);
    }