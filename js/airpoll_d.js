    var color2;
    var cValue2;

    function read_csv_d(d_path1, d_path2, d_path3, xAmount, coeff, intercept, caption, id, dataset, newline){
        d3.csv(d_path1, function (error, data){
            if(error){
                 
            } else{
                data.map(function(d){ 
                    no2d.push(parseFloat(d.NO2));
                    o3d.push(parseFloat(d.O3)); 
                    pm25d.push(parseFloat(d.PM25)); 
                    bcd.push(parseFloat(d.BC));
                    boroughd.push((d.Borough));
                    cbd.push((d.CB));
                    neighd.push((d.Neighbourhood));                      
                });
            };
            second_csv_d(d_path2, d_path3, xAmount, coeff, intercept, caption, id)
        });                                
    } 

    function second_csv_d(d_path2, d_path3, xAmount, coeff, intercept, caption, id){
        d3.csv(d_path2, function (error, data){
            if(error){
                console.log(error)
            } else{
                data.map(function(d){ 
                    if(id == "diameter"){
                        xAmount.push(parseFloat(d.Diameter)); 
                    }    
                });
            };
            third_csv_d(d_path3, xAmount, coeff, intercept, caption, id)
        });                                
    } 

    function third_csv_d(d_path3, xAmount, coeff, intercept, caption, id){
        d3.csv(d_path3, function (error, data){
            if(error){
                console.log(error)
            } else{
                data.map(function(d){ 
                    coeff.push(parseFloat(d.Coeff));
                    intercept.push(parseFloat(d.Intercept));            
                });
            };
            do_svg_stuff_2(xAmount, coeff, intercept, caption, id);
        });                                
    } 


    function do_svg_stuff_2(xAmount, coeff, intercept, caption, id){
        datasetd = fill_data_2(xAmount, no2d, coeff[0], intercept[0], caption);
        // cValue = function(d) { return d.b; },
        //         color = d3.scale.category10();
        // function for creation of line
        newlined = d3.line()
            .x(function(d) {
                return xScale(d.x);
            })
            .y(function(d) {
                return yScale(d.yhat);
            });


        ////// Define Scales /////////////////
        xScale  = d3.scaleLinear()
                              .domain([
                                d3.min(datasetd, function(d){
                                  return d.x;
                                }),
                                d3.max(datasetd, function(d){
                                  return d.x;
                              })])
                              .range([paddingd+10,wd - 10 - paddingd*2]);

        yScale = d3.scaleLinear()
                              .domain([
                                d3.min(datasetd, function(d){
                                  return(d.y);
                                }),
                                d3.max(datasetd, function(d){
                                  return (d.y);
                              })]) //y range is reversed because svg
                              .range([hd-paddingd-10, paddingd+11]);
        /////// Define Axis //////////////////////////////
        xAxisd = d3.axisBottom()
                          .scale(xScale );

        yAxisd = d3.axisLeft()
                      .scale(yScale)
                      .ticks(5);
        // create svg
        svg_airpoll2 = d3.select("#airpoll")
                    .append("svg")
                    .attr("width",wd)
                    .attr("height", hd);

        // cut off datapoints that are outside the axis
        svg_airpoll2.append("clipPath")
            .attr("id", "chart-area")
            .append("rect")
            .attr("x", paddingd)
            .attr("y", paddingd)
            .attr("width", wd-paddingd * 3)
            .attr("height", hd-paddingd *2);

        // append data points
        svg_airpoll2.append("g")
            .attr("clip-path", "url(#chart-area)")
            .selectAll("circle")
            .data(datasetd)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", function(d){
              return xScale (d.x);
            })
            .attr("cy", function(d){
              return yScale(d.y);
            })
            .attr("r", 4.5)
            .attr("opacity", "0.9")
            .attr("id", function(d){
                return "cb1d"+d.CB;
            })
            .style("fill", function(d) {cValue2 = function (d) { return d; },
        color2 = d3.scale.category10(); return color2(cValue2(d.b)); })
            .on("mouseover", function(d, i) {
                tooltipd.transition()
                        .duration(200)
                        .style("opacity", .9);
                tooltipd.html(d.CB + "<br/> (" + (d.neigh) 
                                + ")")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");

                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", "4.0")
                    .style("opacity", "0.7")

                d3  .select("#cb_d" + d.CB)
                    .style("opacity", "0.4");
            })
            .on("mouseout", function(d) {
                tooltipd.transition()
                       .duration(500)
                       .style("opacity", 0);
                d3  .select("#cb_d" + d.CB)
                    .style("opacity", "0.9");
                d3.select(this)
                    .style("stroke-width", "0.5")
                    .style("opacity", "0.9")
            });


        // append regression line
        svg_airpoll2.append("path")
            .datum(datasetd)
            .attr("clip-path", "url(#chart-area)")
            .attr("class", "line")
            .attr("d", newlined);

        // append Axes ///////////////////////////
        svg_airpoll2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (hd-paddingd) + ")")
            .call(xAxisd)
            .append("text")
            .attr("class", "label")
            .attr("x", wd)
            .attr("y", -6);

        svg_airpoll2.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + paddingd + ",0)")
            .call(yAxisd)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");

        svg_airpoll2.append("text")
            .attr("class", "xaxis_label")
            .attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (wd/2+270) +","+((hd-((paddingd-2)/10))-45)+")")  // centre below axis
            .text(function(){
                if (id == "diameter"){
                    return ("Diameter")
                }
            });

        svg_airpoll2.append("text")
            .attr("class", "yaxis_label")
            .attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ ((paddingd/5)+40) +","+((hd-(paddingd+160))/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(caption);



          // draw legend
        legendd = svg_airpoll2.selectAll(".legend")
                    .data(color2.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(-140," + i * 20 + ")"; });

          // draw legend colored rectangles
        legendd.append("rect")
              .attr("x", wd - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color2);

          // draw legend text
        legendd.append("text")
              .attr("x", wd - 20)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d;})

        tooltipd = d3.select("#airpoll").append("div")
                    .attr("class", "tooltip")
                    .style("z-index", 10000)
                    .style("opacity", 0);

    }

    function update_fig_d(airpoll, n, caption){
        datasetd = fill_data_2(diameter, airpoll, coeffd[n], interceptd[n], caption);
        //Update scale domains
        xScale .domain([
            d3.min(datasetd, function(d) { return d.x; }), 
            d3.max(datasetd, function(d) { return d.x; })
        ]);
        yScale.domain([
           d3.min(datasetd, function(d) { return d.y; }),
           d3.max(datasetd, function(d) { return d.y; })
        ]);

        // update data points
        svg_airpoll2.selectAll("circle")
            .data(datasetd)
            .transition()
            .duration(1000)
            .attr("cx", function(d){
              return xScale (d.x);
            })
            .attr("cy", function(d){
              return yScale(d.y);
            });

        // update and transition regression line
        svg_airpoll2.select("path")
            .datum(datasetd)
            .transition()
            .duration(1000)
            .attr("d", newlined);

        // update axis
        svg_airpoll2.select(".x.axis")
              .transition()
              .duration(1000)
              .call(xAxisd);

        svg_airpoll2.select(".y.axis")
                .transition()
                .duration(1000)
                .call(yAxisd);

        svg_airpoll2.select(".yaxis_label")
                    .transition()
                    .duration(4000)
                    .text(caption);
    }

    function fill_data_2(x, y, coeff, intercept, caption) {
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
                "b": boroughd[i],
                "CB": cbd[i],
                "neigh": neighd[i]
            })
        }
        return (data);
    }