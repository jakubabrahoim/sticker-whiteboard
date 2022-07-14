<script setup lang="ts">
    import * as go from "gojs";
    import { OhVueIcon } from "oh-vue-icons";
</script>

<script lang="ts">
    export default {
        components: {
            "v-icon": OhVueIcon
        },
        data() {
            return {
                nodeDataArray: [
                ],
                linkDataArray: [
                ],
                diagram: null,
                currentZoom: 100
            }
        },
        mounted() {
            let $ = go.GraphObject.make;
            
            // Diagram setup
            this.$options.diagram = $(go.Diagram, "diagram", {
                "grid.visible": true,
                "undoManager.isEnabled": true,
            });
            this.$options.diagram.grid.gridCellSize = new go.Size(20, 20);
            this.$options.diagram.grid.opacity = 0.5;
            this.$options.diagram.toolManager.draggingTool.isGridSnapEnabled = true;
            this.$options.diagram.toolManager.resizingTool.isGridSnapEnabled = true;

            this.$options.diagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);

            // Setup for node (element) and link templates
            this.$options.diagram.nodeTemplate = $(
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
                        name: "Sticker",
                    }, 
                    new go.Binding("fill", "color"), 
                    new go.Binding("stroke", "color")
                ),
                // Left port
                $(
                    go.Shape, "Ellipse",
                    {
                        fill: "white",
                        strokeWidth: 1,
                        desiredSize: new go.Size(7, 7), alignment: go.Spot.Left,
                        portId: "left",
                        fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                        fromLinkable: true, toLinkable: true,
                        opacity: 0.5,
                    }
                ),
                // Right port
                $(
                    go.Shape, "Ellipse",
                    {
                        fill: "white",
                        strokeWidth: 1,
                        desiredSize: new go.Size(7, 7), alignment: go.Spot.Right,
                        portId: "right",
                        fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                        fromLinkable: true, toLinkable: true,
                        opacity: 0.5,
                    }
                ),
                // Top port
                $(
                    go.Shape, "Ellipse",
                    {
                        fill: "white",
                        strokeWidth: 1,
                        desiredSize: new go.Size(7, 7), alignment: go.Spot.Top,
                        portId: "top",
                        fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                        fromLinkable: true, toLinkable: true,
                        opacity: 0.5,
                    }
                ),
                // Bottom port
                $(
                    go.Shape, "Ellipse",
                    {
                        fill: "white",
                        strokeWidth: 1,
                        desiredSize: new go.Size(7, 7), alignment: go.Spot.Bottom,
                        portId: "bottom",
                        fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                        fromLinkable: true, toLinkable: true,
                        opacity: 0.5,
                    }
                ),
                $(
                    go.TextBlock, "text", 
                    {
                        margin: 10,
                        font: "12px sans-serif", 
                        isMultiline: true, 
                        editable: true, 
                        formatting: go.TextBlock.FormatTrim,
                        overflow: go.TextBlock.OverflowClip,
                        wrap: go.TextBlock.None,
                    }, 
                    new go.Binding("text", "key")
                )
            );

            this.$options.diagram.linkTemplate = $(
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
            this.$options.diagram.model.linkToPortIdProperty = "toPort";
            // @ts-ignore
            this.$options.diagram.model.linkFromPortIdProperty = "fromPort";
        },
        methods: {
            addSticker() {
                this.$options.diagram.model.addNodeData({
                    key: "Edit this! ",
                    color: "lightblue",
                });
            },
            zoomIn() {
                if(this.currentZoom + 5 > 200) return;
                this.$options.diagram.commandHandler.increaseZoom();
                this.currentZoom += 5;
            },
            zoomOut() {
                if(this.currentZoom - 5 < 0) return;
                this.$options.diagram.commandHandler.decreaseZoom();
                this.currentZoom -= 5;
            },
        }
    }
</script>

<template>
    <div class="w-full h-screen relative">
        <div id="diagram" class="border border-black border-b-0 w-full h-98 bg-white relative">
        </div>
        <div class="flex flex-row items-center justify-center h-2 border border-gray-50">
                <button 
                    class="text-purple-500 hover:text-purple-500 hover:bg-purple-100 rounded-lg px-1 py-1 mx-2 justify-self-start"
                    @click="addSticker"
                    aria-labelledby="addNoteLabel"
                >
                    <v-icon name="bi-sticky" scale="1.5"></v-icon>
                    <span id="addNoteLabel" hidden>Add Sticky Note</span>
                </button>

                <div class="flex items-center border borde-gray-300 rounded-lg py-1">
                    <button
                        class="text-purple-500 hover:text-purple-500 hover:bg-purple-100 rounded-lg px-1 py-1 mx-2"
                        @click="zoomOut"
                        aria-labelledby="zoomOutLabel"
                    >
                        <v-icon name="co-minus" scale="1.5"></v-icon>
                        <span id="zoomOutLabel" hidden>Zoom Out</span>
                    </button>
                    <span class="text-purple-500">{{currentZoom}} %</span>
                    <button 
                    class="text-purple-500 hover:text-purple-500 hover:bg-purple-100 rounded-lg px-1 py-1 mx-2"
                    @click="zoomIn"
                    aria-labelledby="zoomInLabel"
                    >
                        <v-icon name="bi-plus-lg" scale="1.5"></v-icon>
                        <span id="zoomInLabel" hidden>Zoom In</span>
                    </button>
                </div>
        </div>
    </div>
</template>