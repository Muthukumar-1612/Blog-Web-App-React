function formatDate() {
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = String(date.getDate()).padStart(2, "0");
    const formatted = `${months[date.getMonth()]}-${day}-${date.getFullYear()}`;

    return formatted;
}

export default formatDate;
