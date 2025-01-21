import { CardHeader } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import React from "react";
import { useState } from "react";
import PercentCard from "../components/PercentCard";
import Graph from "../components/Graph";
import StatCard from "../components/StatCard";
import data from "../data/STAT_DATA";

const metricsData = [
    {
        title: "Active Devices",
        value: "2",
        subtitle: "/5",
    },
    {
        title: "Emissions by devices",
        value: "3,298",
    },
    {
        title: "Av. Session Length",
        value: "10h 54m",
    },
    {
        title: "Total emission",
        value: "546kg",
        subtitle: "Out of 43",
    },
    {
        title: "Carbon emissions",
        value: "86%",
    },
    {
        title: "Total Reduction",
        value: "+34%",
    },
];

const emissionCategories = {
    most: [
        { label: "c20", value: 74, color: "bg-red-500" },
        { label: "N20", value: 52, color: "bg-red-500" },
        { label: "HNo3", value: 36, color: "bg-red-500" },
    ],
    least: [
        { label: "c02", value: 95, color: "bg-green-500" },
        { label: "h20", value: 92, color: "bg-green-500" },
        { label: "h3", value: 89, color: "bg-green-500" },
    ],
};

export default function Analatics() {
    const [timeFrame, setTimeFrame] = useState('All-Time')
    const [device, setDevice] = useState('all')
    const [graph, setGraph] = useState(false)


    return graph ?

        (<div className=" gap-3 p-3 w-full h-screen grid row-span-5 col-span-5">
            <div className='row-span-1 col-span-1 bg-white border-1 rounded border-slate-300 shadow-md h-20'><StatCard {...data[0]} /></div>
            <div className='row-span-1 col-span-1 bg-white border-1 rounded border-slate-300 shadow-md h-20'><StatCard {...data[1]} /></div>
            <div className='row-span-1 col-span-1 bg-white border-1 rounded border-slate-300 shadow-md h-20'><StatCard {...data[2]} /></div>
            <div className='row-span-4 col-span-5 bg-white border-1 rounded border-slate-300 shadow-md'><Graph /></div>

        </div>)

        : (<div className=" h-screen">
            <div className=" min-w-full mx-auto p-3">
                <h1 className="text-2xl font-medium ">Analytics</h1>
                <div className="grid grid-cols-2 gap-4 mb-4">

                    {/* <FormControl fullWidth className="bg-slate-900 items-center justify-center">
                        <InputLabel id="demo-simple-select-label">Timeframe: </InputLabel>
                        <Select
                        //     labelId="demo-simple-select-label"
                        //     id="demo-simple-select"
                        //     value={age}
                        //     label="Age"
                        // onChange={handleTimeChange}
                        >
                            <MenuItem value={10}>All-time</MenuItem>
                            <MenuItem value={20}>Last Month</MenuItem>
                            <MenuItem value={30}>Last 3 Month</MenuItem>
                            <MenuItem value={30}>Last 6 Month</MenuItem>
                        </Select>
                    </FormControl> */}

                    {/* <Dropdown>
                        <DropdownTrigger>
                            <Button>Timeframe</Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem onPress={() => setTimeFrame("All-Time")} key={""}>All-time</DropdownItem>
                            <DropdownItem onPress={() => setTimeFrame("Last Month")} key={""}>Last Month</DropdownItem>
                            <DropdownItem onPress={() => setTimeFrame("Last 3 Month")} key={""}>Last 3 Month</DropdownItem>
                            <DropdownItem onPress={() => setTimeFrame("Last 6 Month")} key={""}>Last 6 Month</DropdownItem>
                        </DropdownMenu>
                    </Dropdown> */}


                    <div className="m-2 box-border">
                        <div className="bg-white text-black p-2 rounded-lg flex items-center border-2 border-solid border-slate-300 cursor-pointer transition-colors ">
                            <span className=" hover:bg-slate-300">Timeframe</span>
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8"></div>
                        </div>
                        <ul className="list-none bg-white p-1 border-2 border-solid border-slate-300 rounded-lg shadow-md text-black left-[50%] top-1 translate-x-[50%] opacity-0 z-10">
                            <li className="p-1 rounded-md cursor-pointer hover:bg-slate-300">All-time</li>
                            <li className="p-1 rounded-md cursor-pointer hover:bg-slate-300">Last Month</li>
                            <li className="p-1 rounded-md cursor-pointer hover:bg-slate-300">Invision Studio</li>
                            <li className="active">Figma</li>
                            <li className="p-1 rounded-md cursor-pointer hover:bg-slate-300">Adobe XD</li>
                        </ul> </div>


                    <div className="dropdown">
                        <div className="select">
                            <span className="selected">All Device</span>
                            <div className="caret"></div>
                        </div>
                        <ul className="menu">
                            <li className="active">All Devices</li>
                            <li>Device 1</li>
                            <li>Device 2</li>
                        </ul>
                    </div>


                    <Dropdown>
                        <DropdownTrigger>
                            <Button>Device</Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem onPress={() => setDevice("all")} key={""}>All Devices</DropdownItem>
                            <DropdownItem onPress={() => setDevice("Device 1")} key={""}>Device 1</DropdownItem>
                            <DropdownItem onPress={() => setDevice("Device 2")} key={""}>Device 2</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    {/* <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Device: </InputLabel>
                        <Select
                        //     labelId="demo-simple-select-label"
                        //     id="demo-simple-select"
                        //     value={age}
                        //     label="Age"
                        // onChange={handleDeviceChange}
                        >
                            <MenuItem value={10}>All</MenuItem>
                            <MenuItem value={20}>Device 1</MenuItem>
                            <MenuItem value={30}>Device 2</MenuItem>
                        </Select>
                    </FormControl> */}

                </div>
                <div className="min-w-full max-h-screen grid grid-cols-2 grid-flow-row auto-rows-min gap-2">
                    <div className="px-1 grid grid-cols-3 gap-4 mb-2">
                        {metricsData.map((metric, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6 bg-white">
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">{metric.title}</p>
                                        <div className="flex items-baseline">
                                            <span className="text-lg font-bold">{metric.value}</span>
                                            {metric.subtitle && (
                                                <span className="text-xs text-muted-foreground ml-1">
                                                    {metric.subtitle}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="px-1 bg-white h-65  border-1 rounded border-slate-300 shadow-sm" onClick={() => setGraph(true)}>
                        <Graph />
                    </div>
                    <div className="px-1">
                        <PercentCard title="Most Emission-Intensive Category" stats={emissionCategories.most} />
                    </div>
                    <div className="px-1">
                        <PercentCard title="Least Emission-Intensive Category" stats={emissionCategories.least} />
                    </div>
                </div>
            </div>
        </div>
        );
}