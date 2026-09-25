import { IntervalType } from './types';

/**
 * Built-in task template library, grouped by category. Category names are
 * localized (`templates.categories.*`); template titles and descriptions are
 * currently English-only — they prefill an editable form, so users can adjust
 * wording before saving.
 */

export type TemplateCategory =
    | 'hvac'
    | 'plumbing'
    | 'electrical'
    | 'appliances'
    | 'interior'
    | 'exterior'
    | 'yard'
    | 'safety'
    | 'vehicles';

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
    'hvac',
    'plumbing',
    'electrical',
    'appliances',
    'interior',
    'exterior',
    'yard',
    'safety',
    'vehicles',
];

export interface TaskTemplate {
    title: string;
    description: string;
    interval_value: number;
    interval_type: IntervalType;
    icon: string;
    category: TemplateCategory;
}

const t = (
    category: TemplateCategory,
    title: string,
    description: string,
    interval_value: number,
    interval_type: IntervalType,
    icon: string,
): TaskTemplate => ({ category, title, description, interval_value, interval_type, icon });

export const TASK_TEMPLATES: TaskTemplate[] = [
    // HVAC
    t('hvac', 'Replace HVAC filter', 'Replace the furnace/air-handler filter; check size and MERV rating.', 3, 'months', 'mdi:air-filter'),
    t('hvac', 'Service furnace', 'Annual professional furnace inspection and tune-up before heating season.', 1, 'years', 'mdi:fire'),
    t('hvac', 'Service air conditioner', 'Annual professional A/C inspection and refrigerant check before cooling season.', 1, 'years', 'mdi:air-conditioner'),
    t('hvac', 'Clean A/C condenser coils', 'Rinse debris from the outdoor condenser unit and clear vegetation around it.', 6, 'months', 'mdi:hvac'),
    t('hvac', 'Clean air vents and registers', 'Vacuum supply and return registers; check for blockages.', 6, 'months', 'mdi:air-purifier'),
    t('hvac', 'Clean ceiling fan blades', 'Dust fan blades and check for wobble; reverse direction seasonally.', 6, 'months', 'mdi:ceiling-fan'),
    t('hvac', 'Replace humidifier filter', 'Replace the whole-home humidifier evaporator pad.', 1, 'years', 'mdi:air-humidifier'),
    t('hvac', 'Clean dehumidifier', 'Empty, clean the tank and filter, and check drainage.', 3, 'months', 'mdi:water-percent'),
    t('hvac', 'Have air ducts inspected', 'Inspect ductwork for leaks and dust buildup; consider cleaning.', 5, 'years', 'mdi:pipe'),
    t('hvac', 'Clean bathroom exhaust fans', 'Remove covers and vacuum dust from bathroom exhaust fans.', 6, 'months', 'mdi:fan'),
    // Plumbing
    t('plumbing', 'Flush water heater', 'Drain sediment from the water heater tank and test the pressure-relief valve.', 1, 'years', 'mdi:water-boiler'),
    t('plumbing', 'Test sump pump', 'Pour water into the sump pit and verify the pump runs and drains.', 3, 'months', 'mdi:water-pump'),
    t('plumbing', 'Clean faucet aerators', 'Unscrew aerators and rinse out sediment for steady flow.', 6, 'months', 'mdi:faucet'),
    t('plumbing', 'Check for plumbing leaks', 'Inspect under sinks, around toilets, and exposed pipes for moisture.', 3, 'months', 'mdi:pipe-leak'),
    t('plumbing', 'Clean shower heads', 'Descale shower heads with vinegar to restore spray pattern.', 6, 'months', 'mdi:shower-head'),
    t('plumbing', 'Inspect washing machine hoses', 'Check supply hoses for bulges or leaks; replace every 5 years.', 6, 'months', 'mdi:washing-machine'),
    t('plumbing', 'Clean garbage disposal', 'Freshen the disposal with ice, citrus peel, and a rinse.', 1, 'months', 'mdi:sink'),
    t('plumbing', 'Snake slow drains', 'Clear hair and buildup from bathroom drains before they clog.', 6, 'months', 'mdi:pipe-wrench'),
    t('plumbing', 'Inspect toilet internals', 'Check flapper, fill valve, and for silent leaks with a dye test.', 1, 'years', 'mdi:toilet'),
    t('plumbing', 'Service water softener', 'Check salt level and clean the brine tank.', 1, 'months', 'mdi:water-opacity'),
    t('plumbing', 'Replace water filter cartridge', 'Replace under-sink or whole-home water filter cartridges.', 6, 'months', 'mdi:filter'),
    t('plumbing', 'Winterize outdoor faucets', 'Disconnect hoses, drain exterior spigots, and insulate before frost.', 1, 'years', 'mdi:snowflake-alert'),
    // Electrical
    t('electrical', 'Test GFCI outlets', 'Press test/reset on every GFCI outlet to verify protection.', 6, 'months', 'mdi:power-socket-us'),
    t('electrical', 'Test AFCI breakers', 'Trip and reset arc-fault breakers in the panel.', 6, 'months', 'mdi:electric-switch'),
    t('electrical', 'Inspect electrical panel', 'Look for corrosion, heat marks, or loose breakers; label circuits.', 1, 'years', 'mdi:lightning-bolt'),
    t('electrical', 'Check cords and outlets', 'Inspect for frayed cords, warm outlets, and overloaded strips.', 1, 'years', 'mdi:power-plug'),
    t('electrical', 'Test backup generator', 'Run the generator under load and check oil and fuel.', 3, 'months', 'mdi:engine'),
    t('electrical', 'Replace UPS batteries', 'Test uninterruptible power supplies and replace aging batteries.', 3, 'years', 'mdi:battery-charging'),
    t('electrical', 'Dust electronics and vents', 'Blow dust from equipment vents, routers, and media consoles.', 3, 'months', 'mdi:desktop-classic'),
    // Appliances
    t('appliances', 'Clean refrigerator coils', 'Vacuum condenser coils under/behind the fridge for efficiency.', 6, 'months', 'mdi:fridge'),
    t('appliances', 'Replace refrigerator water filter', 'Swap the fridge water/ice filter cartridge.', 6, 'months', 'mdi:cup-water'),
    t('appliances', 'Clean dishwasher filter', 'Remove and rinse the dishwasher filter; wipe door seals.', 1, 'months', 'mdi:dishwasher'),
    t('appliances', 'Run dishwasher cleaner', 'Run an empty hot cycle with dishwasher cleaner or vinegar.', 3, 'months', 'mdi:dishwasher-alert'),
    t('appliances', 'Clean washing machine', 'Run a tub-clean cycle and wipe the door gasket to prevent mildew.', 3, 'months', 'mdi:washing-machine'),
    t('appliances', 'Clean dryer lint duct', 'Disconnect the dryer and clear lint from the duct to the exterior vent.', 1, 'years', 'mdi:tumble-dryer'),
    t('appliances', 'Vacuum dryer lint housing', 'Vacuum the lint-screen housing and behind the dryer.', 3, 'months', 'mdi:tumble-dryer-alert'),
    t('appliances', 'Clean oven', 'Deep-clean the oven interior and door glass.', 6, 'months', 'mdi:stove'),
    t('appliances', 'Clean range hood filter', 'Degrease the range hood mesh filter in hot soapy water.', 3, 'months', 'mdi:fan'),
    t('appliances', 'Descale coffee maker', 'Run a descaling cycle through the coffee maker or espresso machine.', 3, 'months', 'mdi:coffee-maker'),
    t('appliances', 'Clean microwave and seals', 'Clean interior, turntable, and check door seals.', 1, 'months', 'mdi:microwave'),
    t('appliances', 'Defrost chest freezer', 'Defrost and clean the freezer; check door gaskets.', 1, 'years', 'mdi:fridge-bottom'),
    t('appliances', 'Replace vacuum filters', 'Replace or wash vacuum cleaner filters and check the brush roll.', 6, 'months', 'mdi:robot-vacuum'),
    // Interior
    t('interior', 'Deep clean carpets', 'Shampoo or steam-clean carpets and rugs.', 1, 'years', 'mdi:rug'),
    t('interior', 'Wash windows inside', 'Clean interior window glass, sills, and tracks.', 6, 'months', 'mdi:window-closed-variant'),
    t('interior', 'Clean window treatments', 'Dust or launder blinds, shades, and curtains.', 6, 'months', 'mdi:blinds'),
    t('interior', 'Touch up paint and caulk', 'Touch up wall paint; re-caulk tubs, showers, and backsplashes.', 1, 'years', 'mdi:format-paint'),
    t('interior', 'Lubricate door hinges and locks', 'Silence squeaks and lubricate locks with graphite.', 1, 'years', 'mdi:door'),
    t('interior', 'Clean baseboards and trim', 'Wipe down baseboards, door frames, and switch plates.', 3, 'months', 'mdi:broom'),
    t('interior', 'Rotate mattresses', 'Rotate (and flip if applicable) mattresses for even wear.', 3, 'months', 'mdi:bed'),
    t('interior', 'Wash pillows and duvets', 'Launder pillows, duvets, and mattress protectors.', 6, 'months', 'mdi:bed-king'),
    t('interior', 'Inspect attic and basement', 'Look for leaks, pests, and mold in the attic and basement/crawlspace.', 6, 'months', 'mdi:home-search'),
    t('interior', 'Check door and window seals', 'Inspect weatherstripping and replace worn seals.', 1, 'years', 'mdi:window-shutter'),
    t('interior', 'Clean light fixtures', 'Dust fixtures and wash glass shades; replace dim bulbs.', 6, 'months', 'mdi:ceiling-light'),
    t('interior', 'Descale humidifiers', 'Descale and disinfect portable humidifiers.', 1, 'months', 'mdi:air-humidifier'),
    // Exterior
    t('exterior', 'Clean gutters', 'Remove leaves and debris from gutters and check downspout flow.', 6, 'months', 'mdi:home-roof'),
    t('exterior', 'Inspect roof', 'Check shingles/flashing for damage from the ground or ladder.', 1, 'years', 'mdi:home-alert'),
    t('exterior', 'Wash siding', 'Rinse or soft-wash siding to remove dirt and mildew.', 1, 'years', 'mdi:home-modern'),
    t('exterior', 'Wash windows outside', 'Clean exterior window glass and screens.', 6, 'months', 'mdi:window-open-variant'),
    t('exterior', 'Inspect driveway and walkways', 'Look for cracks to seal and settled pavers to relevel.', 1, 'years', 'mdi:road-variant'),
    t('exterior', 'Seal deck or fence', 'Clean and re-stain/seal wooden decks and fences.', 2, 'years', 'mdi:fence'),
    t('exterior', 'Inspect exterior paint and caulk', 'Check for peeling paint and failed caulk around openings.', 1, 'years', 'mdi:brush'),
    t('exterior', 'Clean garage door tracks', 'Clear tracks, lubricate rollers/springs, and test auto-reverse.', 1, 'years', 'mdi:garage'),
    t('exterior', 'Inspect foundation', 'Walk the foundation looking for new cracks or water pooling.', 1, 'years', 'mdi:home-floor-b'),
    t('exterior', 'Check chimney and cap', 'Inspect the chimney exterior and cap; schedule a sweep if used.', 1, 'years', 'mdi:fireplace'),
    t('exterior', 'Clean outdoor furniture', 'Wash outdoor furniture and check covers.', 6, 'months', 'mdi:table-chair'),
    t('exterior', 'Clean grill', 'Deep-clean grill grates and burners; check propane connections.', 6, 'months', 'mdi:grill'),
    // Yard
    t('yard', 'Fertilize lawn', 'Apply seasonal fertilizer appropriate for your grass type.', 3, 'months', 'mdi:grass'),
    t('yard', 'Prune trees and shrubs', 'Prune dead growth and branches near the house or lines.', 1, 'years', 'mdi:tree'),
    t('yard', 'Mulch garden beds', 'Refresh mulch in planting beds for moisture and weed control.', 1, 'years', 'mdi:flower'),
    t('yard', 'Service lawn mower', 'Change oil, sharpen the blade, and replace the spark plug.', 1, 'years', 'mdi:mower'),
    t('yard', 'Start up irrigation system', 'Recharge the sprinkler system and check heads in spring.', 1, 'years', 'mdi:sprinkler-variant'),
    t('yard', 'Winterize irrigation system', 'Blow out sprinkler lines before the first freeze.', 1, 'years', 'mdi:sprinkler'),
    t('yard', 'Clean and store hoses', 'Drain garden hoses and check spray nozzles.', 1, 'years', 'mdi:watering-can'),
    t('yard', 'Inspect trees after storms', 'Check for damaged limbs and clear debris.', 6, 'months', 'mdi:tree-outline'),
    t('yard', 'Reseed bare lawn spots', 'Overseed thin areas and water until established.', 1, 'years', 'mdi:seed'),
    // Safety
    t('safety', 'Test smoke detectors', 'Press the test button on every smoke detector.', 1, 'months', 'mdi:smoke-detector'),
    t('safety', 'Test carbon monoxide detectors', 'Test CO detectors and note their replacement date.', 1, 'months', 'mdi:molecule-co'),
    t('safety', 'Replace detector batteries', 'Replace batteries in smoke and CO detectors.', 1, 'years', 'mdi:battery-alert'),
    t('safety', 'Inspect fire extinguishers', 'Check gauge pressure, pin, and expiration on each extinguisher.', 6, 'months', 'mdi:fire-extinguisher'),
    t('safety', 'Practice fire escape plan', 'Review and practice the household emergency escape plan.', 1, 'years', 'mdi:exit-run'),
    t('safety', 'Check emergency kit', 'Rotate water, food, batteries, and medications in the emergency kit.', 6, 'months', 'mdi:medical-bag'),
    t('safety', 'Test security system', 'Test alarm sensors, cameras, and backup batteries.', 6, 'months', 'mdi:shield-home'),
    t('safety', 'Clean dryer vent exterior flap', 'Verify the exterior dryer vent flap opens and is lint-free.', 6, 'months', 'mdi:tumble-dryer'),
    t('safety', 'Test water shutoff valve', 'Exercise the main water shutoff so it moves freely in an emergency.', 1, 'years', 'mdi:valve'),
    t('safety', 'Restock first aid kit', 'Replace used and expired first aid supplies.', 6, 'months', 'mdi:bandage'),
    // Vehicles
    t('vehicles', 'Change vehicle oil', 'Change engine oil and filter per the manufacturer schedule.', 6, 'months', 'mdi:oil'),
    t('vehicles', 'Rotate tires', 'Rotate tires and check tread depth and pressure.', 6, 'months', 'mdi:tire'),
    t('vehicles', 'Replace wiper blades', 'Replace windshield wiper blades and top up washer fluid.', 1, 'years', 'mdi:wiper'),
    t('vehicles', 'Check vehicle battery', 'Test battery health and clean terminal corrosion.', 1, 'years', 'mdi:car-battery'),
    t('vehicles', 'Replace cabin air filter', 'Replace the vehicle cabin air filter.', 1, 'years', 'mdi:car-defrost-front'),
    t('vehicles', 'Wash and wax vehicle', 'Wash, decontaminate, and wax the paint.', 3, 'months', 'mdi:car-wash'),
    t('vehicles', 'Check bicycle tune-up', 'Lubricate the chain, check brakes and tire pressure.', 6, 'months', 'mdi:bike'),
];
