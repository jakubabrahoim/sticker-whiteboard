<script setup lang="ts">
    import * as go from 'gojs';
</script>

<script lang="ts">
    export default {
        data() {
            return {
                nodeDataArray: [
                    { key: "A", color: "lightblue", text: "" },
                    { key: "B", color: "lightyellow", text: ""},
                    { key: "C", color: "lightpink", text: "" },
                    { key: "D", color: "lightgreen", text: "" }
                ],
                linkDataArray: [
                    { from: "A", to: "B" },
                    { from: "A", to: "C" },
                    { from: "B", to: "D" },
                    { from: "C", to: "D" }
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
            diagram.toolManager.draggingTool.isGridSnapEnabled = true;
            diagram.toolManager.resizingTool.isGridSnapEnabled = true;

            diagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);

            // Setup for node (element) and link templates
            diagram.nodeTemplate = $(go.Node, "Auto",
                $(go.Shape, "Rectangle", {fill: "white"}, new go.Binding("fill", "color"), new go.Binding("stroke", "color")),
                $(go.TextBlock, "text", {margin: 10}, new go.Binding("text", "key"))
            );

            diagram.linkTemplate = $(go.Link, {routing: go.Link.AvoidsNodes, corner: 5},
                $(go.Shape, new go.Binding("stroke", "color")),
                $(go.Shape, { toArrow: "Standard", stroke: null }, new go.Binding("fill", "color")),
            )
        },
        methods: {
            addSticker() {
                this.nodeDataArray.push({
                    key: "E",
                    color: "lightblue",
                    text: "Epsilon"
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

