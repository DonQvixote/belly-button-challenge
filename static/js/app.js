
// Declare the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


/////////////////////////////// Initial layout setup  ///////////////////////
function init(){BellyButton(940)

    d3.json(url).then(function(data) {

// Populate Dropdown Menu 
    let names = data.names
    let dropdownMenu = d3.select("#selDataset")  
    
        for(let i =0; i<names.length; i++){
            dropdownMenu.append("option").text(names[i]).property("value",names[i])
        }
    }
  )}


///////////////// Option Changed Listener and function caller ////////////////

function optionChanged(value){BellyButton(value)}
 
/////////////////// Main script //////////////////////////////////

function BellyButton(value){

    d3.json(url).then((data) => {
   
        d3.select("#sample-metadata").html("") // Clears the html for the metadata

////////////// Read the values for the 'x' subject /////////////////

        let info = data.samples

        
        let subject_id = value //Input by the user via the dropdown menu

        let subject_data = info.filter(result => result.id == subject_id)[0]
        
        let otu_ids = subject_data.otu_ids
        let otu_labels = subject_data.otu_labels
        let sample_values = subject_data.sample_values


/////////////////////////// Bar Chart ////////////////////////////////////

        let yvalues = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse()
        let xvalues = sample_values.slice(0,10).reverse()
        let labels = otu_labels.slice(0,10).reverse()

        // Set up the trace for the bar chart
        let trace = {
            x: xvalues,
            y: yvalues,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTU's Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)

////////////////////// Bubble Chart //////////////////////////////////////////////

        let traceB = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layoutB = {
            title: "OTU's in the Subject's Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [traceB], layoutB)
        
////////////////////////////// Metadata /////////////////////////////////////////////

        let metadata = data.metadata.filter(result => result.id == subject_id)[0]

        // Read each key:value pair for the subject metadata and modify the HTML to reflect the values
        Object.entries(metadata).forEach(([key,val]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${val}`)
        })

    })


}

init()
    
