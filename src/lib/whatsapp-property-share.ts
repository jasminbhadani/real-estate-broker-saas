export function generatePropertyWhatsappText(property: any) {
  const purpose =
    property.purpose?.toUpperCase() || "";

  const propertyType =
    property.property_type?.toUpperCase() || "PROPERTY";

  const location =
    property.location || "-";

  const price = property.price
    ? `₹${Number(property.price).toLocaleString("en-IN")}`
    : "-";

  const area =
    property.area_value
      ? `${property.area_value} ${property.area_unit || "sq yd"}`
      : "-";

  const configuration =
    property.configuration || "-";

  const status =
    property.status || "Available";

  const brokerPhone =
    property.owner_mobile ||
    property.owner_alternate_mobile ||
    "";

  return `
🏠 ${propertyType} FOR ${purpose}

📍 ${location}
💰 ${price}
📐 ${area}
🛏 ${configuration}

Status: ${status}

Interested?
📞 ${brokerPhone}
`.trim();
}