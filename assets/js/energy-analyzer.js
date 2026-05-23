/**
 * Energy Analyzer - Home Energy Efficiency Calculator
 * Calculates energy consumption, costs, and CO2 emissions for household appliances
 */

const EnergyAnalyzer = {
    // Appliance database with average wattages
    applianceDatabase: [
        // Kitchen Appliances
        { category: 'Kitchen', name: 'Refrigerator (Modern)', watts: 150, dailyHours: 8 },
        { category: 'Kitchen', name: 'Refrigerator (Old)', watts: 400, dailyHours: 8 },
        { category: 'Kitchen', name: 'Dishwasher', watts: 1800, dailyHours: 1 },
        { category: 'Kitchen', name: 'Electric Kettle', watts: 1350, dailyHours: 0.5 },
        { category: 'Kitchen', name: 'Microwave', watts: 1000, dailyHours: 0.5 },
        { category: 'Kitchen', name: 'Coffee Maker', watts: 800, dailyHours: 0.5 },
        { category: 'Kitchen', name: 'Toaster', watts: 1200, dailyHours: 0.25 },
        { category: 'Kitchen', name: 'Electric Oven', watts: 2400, dailyHours: 1 },

        // Entertainment
        { category: 'Entertainment', name: 'LED TV (55 inch)', watts: 80, dailyHours: 4 },
        { category: 'Entertainment', name: 'LCD TV (55 inch)', watts: 150, dailyHours: 4 },
        { category: 'Entertainment', name: 'Gaming Console (Active)', watts: 150, dailyHours: 2 },
        { category: 'Entertainment', name: 'Gaming Console (Standby)', watts: 10, dailyHours: 22 },
        { category: 'Entertainment', name: 'Desktop Computer', watts: 200, dailyHours: 6 },
        { category: 'Entertainment', name: 'Laptop', watts: 50, dailyHours: 6 },
        { category: 'Entertainment', name: 'Sound System', watts: 100, dailyHours: 3 },

        // Climate Control
        { category: 'Climate', name: 'Central AC', watts: 3500, dailyHours: 6 },
        { category: 'Climate', name: 'Window AC Unit', watts: 1200, dailyHours: 6 },
        { category: 'Climate', name: 'Space Heater', watts: 1500, dailyHours: 4 },
        { category: 'Climate', name: 'Ceiling Fan', watts: 75, dailyHours: 8 },
        { category: 'Climate', name: 'Electric Heater', watts: 2000, dailyHours: 4 },

        // Lighting
        { category: 'Lighting', name: 'LED Bulb (10W)', watts: 10, dailyHours: 6 },
        { category: 'Lighting', name: 'CFL Bulb (15W)', watts: 15, dailyHours: 6 },
        { category: 'Lighting', name: 'Incandescent Bulb (60W)', watts: 60, dailyHours: 6 },
        { category: 'Lighting', name: 'LED Strip Lights', watts: 20, dailyHours: 4 },

        // Laundry
        { category: 'Laundry', name: 'Washing Machine', watts: 500, dailyHours: 1 },
        { category: 'Laundry', name: 'Dryer', watts: 3000, dailyHours: 1 },
        { category: 'Laundry', name: 'Iron', watts: 1200, dailyHours: 0.5 },

        // Other
        { category: 'Other', name: 'Hair Dryer', watts: 1500, dailyHours: 0.25 },
        { category: 'Other', name: 'Vacuum Cleaner', watts: 1400, dailyHours: 0.5 },
        { category: 'Other', name: 'Water Heater', watts: 4000, dailyHours: 2 },
        { category: 'Other', name: 'Phone Charger', watts: 5, dailyHours: 2 },
    ],

    // Grid carbon intensity presets (kg CO2 per kWh)
    gridIntensity: {
        low: { value: 0.1, label: 'Low Carbon (Renewable)' },
        average: { value: 0.475, label: 'Average Grid' },
        high: { value: 0.9, label: 'High Carbon (Coal)' }
    },

    // Default electricity rate ($/kWh)
    defaultRate: 0.15,

    /**
     * Calculate energy consumption in kWh
     * Formula: E(kWh) = (Watts × Hours) / 1000
     */
    calculateEnergy(watts, hours) {
        return (watts * hours) / 1000;
    },

    /**
     * Calculate cost
     * Formula: Cost = kWh × Rate
     */
    calculateCost(kWh, rate) {
        return kWh * rate;
    },

    /**
     * Calculate CO2 emissions
     * Formula: CO2 = kWh × Intensity
     */
    calculateCO2(kWh, intensity) {
        return kWh * intensity;
    },

    /**
     * Analyze a single appliance
     */
    analyzeAppliance(watts, dailyHours, electricityRate, carbonIntensity) {
        // Daily calculations
        const dailyKWh = this.calculateEnergy(watts, dailyHours);
        const dailyCost = this.calculateCost(dailyKWh, electricityRate);
        const dailyCO2 = this.calculateCO2(dailyKWh, carbonIntensity);

        // Monthly calculations (30 days)
        const monthlyKWh = dailyKWh * 30;
        const monthlyCost = dailyCost * 30;
        const monthlyCO2 = dailyCO2 * 30;

        // Yearly calculations (365 days)
        const yearlyKWh = dailyKWh * 365;
        const yearlyCost = dailyCost * 365;
        const yearlyCO2 = dailyCO2 * 365;

        return {
            daily: {
                kWh: dailyKWh,
                cost: dailyCost,
                co2: dailyCO2
            },
            monthly: {
                kWh: monthlyKWh,
                cost: monthlyCost,
                co2: monthlyCO2
            },
            yearly: {
                kWh: yearlyKWh,
                cost: yearlyCost,
                co2: yearlyCO2
            }
        };
    },

    /**
     * Get appliances by category
     */
    getAppliancesByCategory() {
        const categories = {};

        this.applianceDatabase.forEach(appliance => {
            if (!categories[appliance.category]) {
                categories[appliance.category] = [];
            }
            categories[appliance.category].push(appliance);
        });

        return categories;
    },

    /**
     * Find appliance by name
     */
    findAppliance(name) {
        return this.applianceDatabase.find(a => a.name === name);
    },

    /**
     * Get efficiency rating based on yearly CO2
     */
    getEfficiencyRating(yearlyCO2) {
        if (yearlyCO2 < 100) return { grade: 'A+', color: '#10b981', label: 'Excellent' };
        if (yearlyCO2 < 500) return { grade: 'A', color: '#22c55e', label: 'Very Good' };
        if (yearlyCO2 < 1000) return { grade: 'B', color: '#3b82f6', label: 'Good' };
        if (yearlyCO2 < 2000) return { grade: 'C', color: '#f59e0b', label: 'Average' };
        if (yearlyCO2 < 3000) return { grade: 'D', color: '#ef4444', label: 'Poor' };
        return { grade: 'F', color: '#991b1b', label: 'Very Poor' };
    },

    /**
     * Get savings potential by comparing to LED bulb
     */
    getSavingsTips(watts, dailyHours, category) {
        const tips = [];

        // Lighting tips
        if (category === 'Lighting' && watts > 15) {
            const ledWatts = 10;
            const savings = this.calculateEnergy(watts - ledWatts, dailyHours) * 365 * this.defaultRate;
            tips.push(`💡 Switch to LED bulbs to save $${savings.toFixed(2)}/year`);
        }

        // Climate tips
        if (category === 'Climate' && watts > 1000) {
            tips.push('🌡️ Use a programmable thermostat to reduce runtime by 20-30%');
            tips.push('🪟 Improve insulation to reduce heating/cooling needs');
        }

        // Kitchen tips
        if (category === 'Kitchen' && watts > 1000) {
            tips.push('⚡ Use energy-efficient appliances with Energy Star rating');
            tips.push('🔌 Unplug appliances when not in use to avoid phantom power');
        }

        // Entertainment tips
        if (category === 'Entertainment') {
            tips.push('💤 Enable power-saving modes and turn off when not in use');
        }

        // General tip
        if (dailyHours > 8) {
            tips.push('⏰ Reduce daily usage time to lower energy consumption');
        }

        return tips;
    },

    /**
     * Compare two appliances
     */
    compareAppliances(appliance1, appliance2, electricityRate, carbonIntensity) {
        const analysis1 = this.analyzeAppliance(
            appliance1.watts,
            appliance1.dailyHours,
            electricityRate,
            carbonIntensity
        );

        const analysis2 = this.analyzeAppliance(
            appliance2.watts,
            appliance2.dailyHours,
            electricityRate,
            carbonIntensity
        );

        return {
            appliance1: { ...appliance1, analysis: analysis1 },
            appliance2: { ...appliance2, analysis: analysis2 },
            savings: {
                yearly: {
                    cost: Math.abs(analysis1.yearly.cost - analysis2.yearly.cost),
                    co2: Math.abs(analysis1.yearly.co2 - analysis2.yearly.co2),
                    kWh: Math.abs(analysis1.yearly.kWh - analysis2.yearly.kWh)
                }
            },
            winner: analysis1.yearly.cost < analysis2.yearly.cost ? 'appliance1' : 'appliance2'
        };
    }
};

// Export for use
window.EnergyAnalyzer = EnergyAnalyzer;
