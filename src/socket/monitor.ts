import { Socket } from 'socket.io';
import os from 'os';
import pidusage from 'pidusage';
import si from 'systeminformation';

const getStats = async () => {
    const loadAverage = os.loadavg();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

    const cpuCount = os.cpus().length;

    const processStats = await pidusage(process.pid);
    const toMB = (arg: number) => (arg / (1024 * 1024)).toFixed(2);
    const processMemory = processStats.memory;

    let cpuData: {
        manufacturer: string;
        processors: number;
        brand: string;
        cache: si.Systeminformation.CpuCacheData;
        speed: { current: number; min: number; max: number };
    };
    await si.cpu((data) => {
        cpuData = {
            manufacturer: data.manufacturer,
            processors: data.processors,
            brand: data.brand,
            cache: data.cache,
            speed: {
                current: data.speed,
                min: data.speedMin,
                max: data.speedMax,
            },
        };
    });

    let cpuTemperature: string | number;
    try {
        const { main } = await si.cpuTemperature();
        cpuTemperature = main;
    } catch (error) {
        cpuTemperature = 'N/A';
    }

    return {
        loadAverage,
        memory: {
            total: toMB(totalMemory),
            free: toMB(freeMemory),
            used: toMB(usedMemory),
            usage: memoryUsagePercentage.toFixed(2),
            process: toMB(processMemory),
        },
        cpu: {
            count: cpuCount,
            temperature: cpuTemperature,
            ...cpuData,
        },
    };
};

export const systemMonitor = (socket: Socket) => {
    setInterval(async () => {
        const stats = await getStats();
        socket.emit('sysmon', stats);
    }, 1000);
};
