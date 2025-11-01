export let session = { status: "inactive" };

export function setSessionStatus(val) {
    session.status = val;
    console.log(session.status);
}