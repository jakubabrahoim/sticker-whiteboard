<script setup lang="ts">
    import * as go from "gojs";
    import { OhVueIcon } from "oh-vue-icons";
    import "emoji-picker-element";
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
                currentZoom: 100,
                emojiPicker: 'hidden'
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
            this.$options.diagram.grid.opacity = 0.3;
            this.$options.diagram.toolManager.draggingTool.isGridSnapEnabled = true;
            this.$options.diagram.toolManager.resizingTool.isGridSnapEnabled = true;
            this.$options.diagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
            
            // Template setup for nodes (stickers/emojis) and links
            let stickerTemplate = $(
                go.Node, "Auto", 
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
                        width: 200,
                        height: 200,
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
                        margin: 20,
                        font: "12px sans-serif", 
                        isMultiline: true, 
                        editable: true, 
                        formatting: go.TextBlock.FormatTrim,
                        overflow: go.TextBlock.OverflowClip,
                        wrap: go.TextBlock.None,
                        alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft,
                        
                    }, 
                    new go.Binding("text", "key")
                )
            );
            let emojiTemplate = $(
                go.Node, "Auto", 
                { 
                    resizeObjectName: "Emoji", 
                    rotatable: true,
                },
                $(
                    go.Shape, "Ellipse", 
                    {
                        fill: "white",
                        name: "Sticker",
                        opacity: 0,
                        width: 100,
                        height: 100,
                    }, 
                    new go.Binding("fill", "color"), 
                    new go.Binding("stroke", "color")
                ), 
                $(
                    go.TextBlock, "text", 
                    {
                        margin: 20,
                        font: "50px sans-serif"
                        
                    }, 
                    new go.Binding("text", "key")
                )
            );

            let templateMap = new go.Map();
            templateMap.add("sticker", stickerTemplate);
            templateMap.add("emoji", emojiTemplate);
            this.$options.diagram.nodeTemplateMap = templateMap;

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

            // Load diagram if data was sent to this url
            if(this.$route.params.data != undefined) {
                this.loadWhiteboard(this.$route.params.data);
            }

            // Event listener for emojis
            document.querySelector('emoji-picker')?.addEventListener('emoji-click', (event) => {
                console.log(event.detail.unicode);
                
                // Add emoji to board
                this.$options.diagram.model.addNodeData({
                    key: event.detail.unicode,
                    color: "lightblue",
                    category: "emoji",
                });
            });

        },
        methods: {
            addSticker() {
                this.$options.diagram.model.addNodeData({
                    key: "Edit this! ",
                    color: "#f7ec1b",
                    category: "sticker",
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
            saveWhiteboard() {
                let data = this.$options.diagram.model.toJson();
                
                let fileUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
                let fileName: string = "whiteboard.json";

                let downloadLink: HTMLAnchorElement = document.createElement("a");
                downloadLink.setAttribute("href", fileUri);
                downloadLink.setAttribute("download", fileName);
                downloadLink.click();
            },
            loadWhiteboard(data: any) {
                this.$options.diagram.model = go.Model.fromJson(JSON.parse(data));
            },
            showEmojiPicker() {
                this.emojiPicker === 'hidden' ? this.emojiPicker = 'visible' : this.emojiPicker = 'hidden';
            }
        }
    }
</script>

<template>
    <div class="w-full h-screen">
        <div id="diagram" class="border border-black border-b-0 w-full h-98 bg-white relative">
        </div>
        <div class="grid grid-cols-3 items-center justify-items-center h-2 border border-gray-50">
            <div class="justify-self-start ml-2">
                <button 
                    class="text-purple-500 hover:text-purple-500 hover:bg-purple-100 h-10 w-10 rounded-lg px-1 py-1 mx-2 justify-self-start"
                    @click="saveWhiteboard"
                    aria-labelledby="addWhiteboardLabel"
                >
                    <v-icon name="co-save" scale="1.5"></v-icon>
                    <span id="saveWhiteboardLabel" hidden>Save Whiteboard</span>
                </button>
            </div>

            <div class="flex flex-row">
                <button 
                    class="text-purple-500 hover:text-purple-500 hover:bg-purple-100 h-10 w-10 rounded-lg px-1 py-1 mx-2 justify-self-start"
                    @click="addSticker"
                    aria-labelledby="addNoteLabel"
                >
                    <v-icon name="bi-sticky" scale="1.5"></v-icon>
                    <span id="addNoteLabel" hidden>Add Sticky Note</span>
                </button>
                <button 
                    class="text-purple-500 hover:text-purple-500 hover:bg-purple-100 h-10 w-10 rounded-lg px-1 py-1 mx-2 justify-self-start"
                    @click="showEmojiPicker"
                    aria-labelledby="addEmojiLabel"
                >
                    <v-icon name="bi-emoji-smile" scale="1.5"></v-icon>
                    <span id="addEmojiLabel" hidden>Add Emoji</span>
                </button>
                <emoji-picker class="light" v-show="emojiPicker === 'visible'"></emoji-picker>
            </div>
                
            <div class="justify-self-end flex items-center border borde-gray-300 rounded-lg py-1 mr-2">
                <button
                class="text-purple-500 hover:text-purple-500 hover:bg-purple-100 rounded-lg px-1 py-1 mx-2"
                @click="zoomOut"
                aria-labelledby="zoomOutLabel"
                >
                    <v-icon name="co-minus" scale="1.5"></v-icon>
                    <span id="zoomOutLabel" hidden>Zoom Out</span>
                </button>
                <span class="text-purple-500 hover:cursor-default">{{currentZoom}} %</span>
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