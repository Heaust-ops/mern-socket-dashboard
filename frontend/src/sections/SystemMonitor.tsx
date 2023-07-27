import { FC, useState } from "react";
import { ResponsiveRadialBar } from "@nivo/radial-bar";
import { useSocketEvent } from "../socket";
import { Box, Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { formatDataH } from "../utils";
import { ResponsiveLine } from "@nivo/line";

interface SystemMonitorProps {}

interface SysData {
  loadAverage: number[];
  memory: {
    total: string;
    free: string;
    used: string;
    usage: number;
    process: string;
  };
  cpu: {
    manufacturer: string;
    processors: number;
    brand: string;
    cache: Record<string, string | number>;
    speed: {
      current: number;
      min: number;
      max: number;
    };
    count: number;
    temperature: string | number;
  };
}

const SystemMonitor: FC<SystemMonitorProps> = () => {
  const [sysData, setSysData] = useState<SysData | null>(null);
  const [cpuSpeedBuffer, setCpuSpeedBuffer] = useState<number[]>([]);
  const [cpuTempBuffer, setCpuTempBuffer] = useState<number[]>([]);
  const isMobile = useMediaQuery("(max-width: 1400px)");

  useSocketEvent<SysData>(
    "sysmon",
    (arg) => {
      setSysData(arg);

      /** Cpu Speeds */
      let tmp = cpuSpeedBuffer;
      tmp.push(arg.cpu.speed.current);
      if (cpuSpeedBuffer.length >= 60) tmp.splice(0, 1);
      setCpuSpeedBuffer(tmp);

      /** Cpu Temps */
      tmp = cpuTempBuffer;
      tmp.push(+(arg.cpu.temperature ?? 0));
      if (cpuTempBuffer.length >= 60) tmp.splice(0, 1);
      setCpuTempBuffer(tmp);
    },
    [cpuSpeedBuffer.length]
  );

  return (
    <>
      <Stack direction={isMobile ? "column" : "row"}>
        <Card
          elevation={5}
          sx={{
            width: "100%",
            marginRight: "1rem",
            padding: "1rem",
            marginTop: isMobile ? 0 : "1rem",
          }}
        >
          <Typography align="center" variant="h5" fontWeight={600}>
            System Information:
          </Typography>
          <br />
          <hr style={{ width: "80%", opacity: 0.3 }} />
          <br />
          <Typography align="center" variant="h5">
            CPU Manufacturer: <b>{sysData?.cpu.manufacturer}</b>
          </Typography>
          <br />

          <Typography align="center" variant="h5">
            CPU Model: <b>{sysData?.cpu.brand}</b>
          </Typography>
          <br />

          <Typography align="center" variant="h5">
            Total Threads: <b>{sysData?.cpu.count}</b>
          </Typography>
          <br />

          <Typography align="center" variant="h5">
            Total Memory: <b>{formatDataH(sysData?.memory.total ?? 0)}</b>
          </Typography>
        </Card>
        <Box sx={{ height: "25rem",width: "100%"}}>
          <MemoryRadialGraph
            free={sysData?.memory.free}
            used={sysData?.memory.used}
          />
          <Typography align="center" variant="h5">
            Memory Used: ( {formatDataH(sysData?.memory.used ?? 0)} /{" "}
            {formatDataH(sysData?.memory.total ?? 0)} )
          </Typography>
        </Box>
      </Stack>
      <br />
      <br />
      <Box sx={{ height: "25rem", width: "100%" }}>
        <CPULineGraph speeds={cpuSpeedBuffer} temps={cpuTempBuffer} />
        <br />
        <br />
        <Typography align="center" variant="h5">
          CPU - Speed: <b>{sysData?.cpu.speed.current ?? 0} GHz</b>,
          Temperature: <b>{sysData?.cpu.temperature ?? 0}deg C</b>
        </Typography>
      </Box>
      <br /><br /><br />
      <br /><br /><br />
      <br /><br /><br />
      <span></span>
    </>
  );
};

export default SystemMonitor;

const CPULineGraph: FC<{ speeds: number[]; temps: number[] }> = ({
  speeds,
  temps,
}) => {
  return (
    <ResponsiveLine
      data={[
        {
          id: "Speed",
          data: speeds.map((y, x) => ({ x, y })),
        },
        {
          id: "Temperature",
          data: temps.map((y, x) => ({ x, y: y / 20 })),
        },
      ]}
      xScale={{ type: "linear" }}
      yScale={{ type: "linear", stacked: true, min: 0, max: 8 }}
      yFormat=" >-.2f"
      curve="natural"
      axisTop={null}
      enableGridX={false}
      colors={{ scheme: "pastel1" }}
      lineWidth={1}
      pointSize={10}
      pointColor={{ theme: "background" }}
      tooltip={({ point }) => (
        <Card elevation={10} sx={{ color: "white", padding: "0.5rem" }}>
          CPU {point.id.split(".")[0]}:{" "}
          {point.id.startsWith("Speed")
            ? `${point.data.yFormatted} GHz`
            : `${+point.data.yFormatted * 20}deg C`}
        </Card>
      )}
      pointBorderWidth={1}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      gridXValues={new Array(60).map((_, i) => i)}
      gridYValues={[0, 1, 2, 3, 4, 5, 6, 7]}
      axisBottom={{
        tickValues: new Array(12).map((_, i) => i * 5),
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: ".2f",
      }}
      axisLeft={{
        tickValues: [0, 1, 2, 3, 4, 5, 6, 7],
        tickSize: 1,
        tickPadding: 5,
        tickRotation: 0,
        format: ".2s",
        legend: "GHz",
        legendOffset: -40,
        legendPosition: "middle",
      }}
    />
  );
};

const MemoryRadialGraph: FC<{
  free?: number | string;
  used?: number | string;
}> = ({ free, used }) => {
  return (
    <ResponsiveRadialBar
      data={[
        {
          id: "Ram",
          data: [
            {
              x: "Used",
              y: +(used ?? 0),
            },
            {
              x: "Free",
              y: +(free ?? 0),
            },
          ],
        },
      ]}
      valueFormat=">-.2f"
      padding={0.4}
      startAngle={-90}
      endAngle={-360}
      cornerRadius={2}
      radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
      labelsTextColor={{ theme: "labels.text.fill" }}
      tooltip={({ bar }) => (
        <Card elevation={10} sx={{ color: "white", padding: "0.5rem" }}>
          {bar.id.split(".")[1]}: {formatDataH(bar.value)}
        </Card>
      )}
      legends={[
        {
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: 80,
          translateY: 0,
          itemsSpacing: 6,
          itemDirection: "left-to-right",
          itemWidth: 100,
          itemHeight: 18,
          symbolSize: 18,
          symbolShape: "square",
        },
      ]}
    />
  );
};
