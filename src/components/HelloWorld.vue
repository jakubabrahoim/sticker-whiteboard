<script setup lang="ts">
    import * as go from 'gojs';
</script>

<script lang="ts">
    export default {
        data() {
            return {
                nodeDataArray: [
                    { key: "A", color: "lightblue"},
                    { key: "B", color: "lightyellow"},
                    { key: "C", color: "lightpink"},
                    { key: "D", color: "lightgreen"},
                ],
                linkDataArray: [
                ]
            }
        },
        mounted() {
            let $ = go.GraphObject.make;

            // Diagram setup
            let diagram = $(go.Diagram, "diagram", {
                "grid.visible": true,
                "undoManager.isEnabled": true,
            });
            diagram.grid.gridCellSize = new go.Size(20, 20);
            diagram.grid.opacity = 0.5;
            diagram.toolManager.draggingTool.isGridSnapEnabled = true;
            diagram.toolManager.resizingTool.isGridSnapEnabled = true;

            diagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);

            // Setup for node (element) and link templates
            diagram.nodeTemplate = $(
                go.Node, "Spot", 
                {
                    resizable: true, 
                    resizeObjectName: "Sticker", 
                    rotatable: true,
                },
                $(
                    go.Shape, "Rectangle", 
                    {
                        fill: "white",
                        width: 200, 
                        height: 200, 
                        name: "Sticker",
                    }, 
                    new go.Binding("fill", "color"), 
                    new go.Binding("stroke", "color")
                ),
                // Left port
                $(
                    go.Shape, 'Ellipse',
                    {
                        fill: "white",
                        strokeWidth: 1,
                        desiredSize: new go.Size(7, 7), alignment: go.Spot.Left,
                        portId: "left",
                        fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                        fromLinkable: true, toLinkable: true,
                    }
                ),
                // Right port
                $(
                    go.Shape, 'Ellipse',
                    {
                        fill: "white",
                        strokeWidth: 1,
                        desiredSize: new go.Size(7, 7), alignment: go.Spot.Right,
                        portId: "right",
                        fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                        fromLinkable: true, toLinkable: true,
                    }
                ),
                // Top port
                $(
                    go.Shape, 'Ellipse',
                    {
                        fill: "white",
                        strokeWidth: 1,
                        desiredSize: new go.Size(7, 7), alignment: go.Spot.Top,
                        portId: "top",
                        fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                        fromLinkable: true, toLinkable: true,
                    }
                ),
                // Bottom port
                $(
                    go.Shape, 'Ellipse',
                    {
                        fill: "white",
                        strokeWidth: 1,
                        desiredSize: new go.Size(7, 7), alignment: go.Spot.Bottom,
                        portId: "top",
                        fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                        fromLinkable: true, toLinkable: true,
                    }
                ),
                $(
                    go.TextBlock, "text", 
                    {
                        margin: 10
                    }, 
                    new go.Binding("text", "key")
                )
            );

            diagram.linkTemplate = $(
                go.Link,
                {
                    routing: go.Link.AvoidsNodes, 
                    corner: 5, 
                    reshapable: true
                },
                $(
                    go.Shape, 
                    { strokeWidth: 1.5 }, 
                    new go.Binding("stroke", "color")
                ),
                $(
                    go.Shape, 
                    { 
                        toArrow: "Standard", 
                        stroke: null 
                    }, 
                    new go.Binding("fill", "color")
                ),
            )

            // These are valid according to the API, ts just buggin
            // @ts-ignore
            diagram.model.linkToPortIdProperty = "toPort";
            // @ts-ignore
            diagram.model.linkFromPortIdProperty = "fromPort";
        },
        methods: {
            addSticker() {
                this.nodeDataArray.push({
                    key: "E",
                    color: "lightblue",
                });
                console.log(this.nodeDataArray);
            }
        }
    }
</script>

<template>
    <div class='w-full h-screen relative'>
        <div id='diagram' class='border border-black border-b-0 w-full h-98 bg-white relative'>
        </div>
        <div class="flex flex-row items-center justify-center h-2 z-[1000]">
                <button @click="addSticker">Sticker</button>
        </div>
        <div>
            <pre>
                <code class="language-ts">
                    {{ nodeDataArray }}
                </code>
            </pre>
        </div>
    </div>
</template>