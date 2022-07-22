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
                emojiPicker: "hidden",
                screen: "windowed"
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
                    isShadowed: true,
                    shadowBlur: 7,
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
                        font: "14px sans-serif", 
                        isMultiline: true, 
                        editable: true, 
                        formatting: go.TextBlock.FormatTrim,
                        overflow: go.TextBlock.OverflowEllipsis,
                        wrap: go.TextBlock.None,
                        alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft,
                        
                    }, 
                    new go.Binding("text", "text")
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
                // Add emoji to board
                this.$options.diagram.model.addNodeData({
                    key: event.detail.unicode,
                    color: "lightblue",
                    category: "emoji",
                });
            });

            // Alert before refresh
            window.onbeforeunload = () => {
                return "Are you sure you want to leave?";
            }

        },
        methods: {
            addSticker() {
                this.$options.diagram.model.addNodeData({
                    key: "",
                    text: "Edit me! 😎",
                    color: "#f7ec1b",
                    category: "sticker",
                });
            },
            zoom(direction: string) {
                if (direction === "in") {
                    if(this.currentZoom + 5 > 200) return;
                    this.$options.diagram.commandHandler.increaseZoom();
                    this.currentZoom += 5;
                } else if (direction === "out") {
                    if(this.currentZoom - 5 < 0) return;
                    this.$options.diagram.commandHandler.decreaseZoom();
                    this.currentZoom -= 5;
                }
            },
            fullScreen() {
                if(this.screen === "windowed") {
                    (this.$refs.container as any).requestFullscreen();
                    this.screen = "fullscreen";
                } else if (this.screen === "fullscreen") {
                    document.exitFullscreen();
                    this.screen = "windowed";
                }
            },
            saveWhiteboardJSON() {
                let data = this.$options.diagram.model.toJson();
                
                let fileUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
                let fileName: string = "whiteboard.json";

                let downloadLink: HTMLAnchorElement = document.createElement("a");
                downloadLink.setAttribute("href", fileUri);
                downloadLink.setAttribute("download", fileName);
                downloadLink.click();
            },
            saveWhiteBoardPNG() {
                let imageData =  this.$options.diagram.makeImageData({
                    scale: 1,
                    type: "image/png",
                    showGrid: true,
                    returnType: "blob",
                    callback: (blob: any) => {
                        let fileUri = URL.createObjectURL(blob);
                        let fileName: string = "whiteboard.png";

                        let downloadLink: HTMLAnchorElement = document.createElement("a");
                        downloadLink.setAttribute("href", fileUri);
                        downloadLink.setAttribute("download", fileName);
                        downloadLink.click();
                    }
                });
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
    <div class="w-full h-screen" ref="container">
        <div id="diagram" class="border border-black border-b-0 w-full h-98 bg-white relative">
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 items-center justify-items-center h-2 bg-white">
            <!-- Export section -->
            <div class="justify-self-center sm:justify-self-start border borde-gray-300 rounded-lg py-1 mb-2 sm:mb-0 sm:ml-2">
                <button 
                    class="text-gray-500 hover:text-purple-500 hover:bg-purple-100 h-10 w-10 rounded-lg px-1 py-1 mx-2 justify-self-start"
                    @click="saveWhiteboardJSON"
                    aria-labelledby="saveWhiteboardLabel"
                >
                    <v-icon name="co-save" scale="1.5"></v-icon>
                    <span id="saveWhiteboardLabel" hidden>Save Whiteboard JSON</span>
                </button>

                <button 
                    class="text-gray-500 hover:text-purple-500 hover:bg-purple-100 h-10 w-10 rounded-lg px-1 py-1 mx-2 justify-self-start"
                    @click="saveWhiteBoardPNG"
                    aria-labelledby="addWhiteboardLabel2"
                >
                    <v-icon name="bi-card-image" scale="1.5"></v-icon>
                    <span id="saveWhiteboardLabel2" hidden>Save Whiteboard PNG</span>
                </button>
            </div>

            <!-- Add to board stuff -->
            <div class="flex flex-row items-center border borde-gray-300 rounded-lg py-1">
                <button 
                    class="text-gray-500 hover:text-purple-500 hover:bg-purple-100 h-10 w-10 rounded-lg px-1 py-1 mx-2 justify-self-start"
                    @click="addSticker"
                    aria-labelledby="addNoteLabel"
                >
                    <v-icon name="bi-sticky" scale="1.5"></v-icon>
                    <span id="addNoteLabel" hidden>Add Sticky Note</span>
                </button>
                <button 
                    class="text-gray-500 hover:text-purple-500 hover:bg-purple-100 h-10 w-10 rounded-lg px-1 py-1 mx-2 justify-self-start"
                    @click="showEmojiPicker"
                    aria-labelledby="addEmojiLabel"
                >
                    <v-icon name="bi-emoji-smile" scale="1.5"></v-icon>
                    <span id="addEmojiLabel" hidden>Add Emoji</span>
                </button>
                <emoji-picker class="light w-[300px] h-[300px]" v-show="emojiPicker === 'visible'"></emoji-picker>
            </div>
            
            <!-- Zoom section -->
            <div class="justify-self-center sm:justify-self-end flex flex-row items-center border borde-gray-300 rounded-lg py-1 mt-2 sm:my-0 sm:mr-2">
                <button
                    class="text-gray-500 hover:text-purple-500 hover:bg-purple-100 rounded-lg px-1 py-1 mx-2"
                    @click="zoom('out')"
                    aria-labelledby="zoomOutLabel"
                >
                    <v-icon name="co-minus" scale="1.5"></v-icon>
                    <span id="zoomOutLabel" hidden>Zoom Out</span>
                </button>

                <span class="text-gray-500 hover:cursor-default">{{currentZoom}} %</span>

                <button 
                    class="text-gray-500 hover:text-purple-500 hover:bg-purple-100 rounded-lg px-1 py-1 mx-2"
                    @click="zoom('in')"
                    aria-labelledby="zoomInLabel"
                >
                    <v-icon name="bi-plus-lg" scale="1.5"></v-icon>
                    <span id="zoomInLabel" hidden>Zoom In</span>
                </button>

                <button 
                    class="text-gray-500 hover:text-purple-500 hover:bg-purple-100 rounded-lg px-1 py-1 mx-2"
                    @click="fullScreen"
                    aria-labelledby="fullscreenLabel"
                >
                    <v-icon name="co-fullscreen" scale="1.25"></v-icon>
                    <span id="fullscreenLabel" hidden>Zoom In</span>
                </button>
            </div>
        </div>
    </div>
</template>